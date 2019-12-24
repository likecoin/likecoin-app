import { onSnapshot } from "mobx-state-tree"

import { Environment } from "../environment"
import { sortContentForSnapshot } from "../reader-store"
import { RootStoreModel, RootStore } from "./root-store"

import * as Keychain from "../../utils/keychain"
import * as storage from "../../utils/storage"
import { logError } from "../../utils/error"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()
  await env.setup()
  return env
}

function createRootStore(env: Environment, data: any = {}) {
  const {
    COSMOS_CHAIN_ID,
    COSMOS_DENOM,
    COSMOS_FRACTION_DENOM,
    COSMOS_FRACTION_DIGITS,
    COSMOS_GAS_PRICE,
  } = env.appConfig.getAllParams()
  if (!data.chainStore) {
    data.chainStore = {
      id: COSMOS_CHAIN_ID,
      denom: COSMOS_DENOM,
      fractionDenom: COSMOS_FRACTION_DENOM,
      fractionDigits: parseInt(COSMOS_FRACTION_DIGITS),
      gasPrice: COSMOS_GAS_PRICE,
    }
  } else if (data.chainStore.id !== COSMOS_CHAIN_ID) {
    throw new Error("CHAIN_HAS_CHANGED")
  }
  const rootStore = RootStoreModel.create(data, env)
  env.authCoreAPI.callbacks.unauthenticated = rootStore.signOut
  env.authCoreAPI.callbacks.unauthorized = rootStore.signOut
  return rootStore
}

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore
  let data: any

  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  try {
    // load data from storage
    data = await storage.load(ROOT_STATE_STORAGE_KEY)
    rootStore = createRootStore(env, data)

    // Setup Authcore
    const [{
      password: authCoreRefreshToken,
    },
    {
      password: authCoreAccessToken,
    },
    {
      password: authCoreIdToken,
    }] = await Promise.all([
      Keychain.load(`${env.appConfig.getValue('AUTHCORE_CREDENTIAL_KEY')}/refresh_token`),
      Keychain.load(`${env.appConfig.getValue('AUTHCORE_CREDENTIAL_KEY')}/access_token`),
      Keychain.load(`${env.appConfig.getValue('AUTHCORE_CREDENTIAL_KEY')}/id_token`),
    ])
    await env.setupAuthCore(authCoreRefreshToken, authCoreAccessToken)
    if (authCoreAccessToken && authCoreRefreshToken) {
      await rootStore.userStore.authCore.init(authCoreRefreshToken, authCoreAccessToken, authCoreIdToken)
      rootStore.chainStore.setupWallet(rootStore.userStore.authCore.primaryCosmosAddress)
    }
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    await env.setupAuthCore()
    rootStore = createRootStore(env)

    // but please inform us what happened
    logError(e.message)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  // track changes & save to storage
  onSnapshot(
    rootStore,
    ({
      /* eslint-disable @typescript-eslint/no-unused-vars */
      navigationStore,
      readerStore: {
        contents,
        featuredList, // Never cache
        followedList, // Never cache
      },
      ...snapshot
      /* eslint-enable @typescript-eslint/no-unused-vars */
    }) => storage.save(ROOT_STATE_STORAGE_KEY, {
      ...snapshot,
      readerStore: {
        contents: Object
          .values(contents)
          .sort(sortContentForSnapshot)
          .slice(0, 1000) // Cache 1,000 contents at max
          .reduce((acc, c) => {
            acc[c.url] = c
            return acc
          }, {}),
      }
    })
  )

  return rootStore
}

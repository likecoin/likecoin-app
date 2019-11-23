import { onSnapshot } from "mobx-state-tree"

import { RootStoreModel, RootStore } from "./root-store"
import { Environment } from "../environment"
import * as Keychain from "../../utils/keychain"
import * as storage from "../../utils/storage"

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

function createRootStore(env: Environment, data = {}) {
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
    data = await storage.load(ROOT_STATE_STORAGE_KEY) || {}
    rootStore = createRootStore(env, data)

    // Setup Authcore
    const {
      username: authCoreIdToken,
      password: authCoreAccessToken,
    } = await Keychain.load(env.appConfig.getValue('AUTHCORE_CREDENTIAL_KEY'))
    env.setupAuthCore(authCoreAccessToken)
    if (authCoreIdToken && authCoreAccessToken) {
      await rootStore.userStore.authCore.init(authCoreIdToken, authCoreAccessToken)
    }
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    await env.setupAuthCore()
    rootStore = createRootStore(env, {})

    // but please inform us what happened
    __DEV__ && console.tron.error(e.message, null)
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
      readerStore: { contents },
      ...snapshot
      /* eslint-enable @typescript-eslint/no-unused-vars */
    }) => storage.save(ROOT_STATE_STORAGE_KEY, {
      ...snapshot,
      readerStore: { contents },
    })
  )

  return rootStore
}

import { onSnapshot } from "mobx-state-tree"

import { Environment } from "../environment"
import { RootStoreModel, RootStore } from "./root-store"

import * as storage from "../../utils/storage"
import { logError } from "../../utils/error"

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
  } = env.appConfig.getAllParams()
  if (!data.chainStore) {
    data.chainStore = {
      id: COSMOS_CHAIN_ID,
      denom: COSMOS_DENOM,
      fractionDenom: COSMOS_FRACTION_DENOM,
      fractionDigits: parseInt(COSMOS_FRACTION_DIGITS),
    }
  } else if (data.chainStore.id !== COSMOS_CHAIN_ID) {
    throw new Error("CHAIN_HAS_CHANGED")
  }
  const rootStore = RootStoreModel.create(data, env)
  env.authCoreAPI.callbacks.unauthenticated = (error: any) => {
    rootStore.handleUnauthenticatedError("Authcore", error)
  }
  env.authCoreAPI.callbacks.unauthorized = (error: any) => {
    rootStore.handleUnauthenticatedError("Authcore", error)
  }
  env.likeCoAPI.config.onUnauthenticated = (error: any) => {
    rootStore.handleUnauthenticatedError("like.co", error)
  }
  env.likerLandAPI.config.onUnauthenticated = (error: any) => {
    rootStore.handleUnauthenticatedError("liker.land", error)
  }
  env.branchIO.setDeepLinkHandler((params: any) => {
    rootStore.deepLinkHandleStore.openBranchDeepLink(params)
  })


  // Start app rating cooldown if necessary
  if (
    !rootStore.userStore.hasPromptedAppRating &&
    rootStore.userStore.appRatingCooldown === -1
  ) {
    rootStore.userStore.startAppRatingCooldown()
  } else if (rootStore.userStore.appRatingCooldown > 0) {
    rootStore.userStore.reduceAppRatingCooldown()
  }

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
  const storageKey = env.appConfig.getValue("ROOT_STATE_STORAGE_KEY")
  try {
    // load data from storage
    data = await storage.load(storageKey) || {}
    rootStore = createRootStore(env, data)

    if (rootStore.userStore.currentUser) {
      rootStore.userStore.authCore.resume().then(() => {
        const address = rootStore.userStore.authCore.primaryCosmosAddress
        rootStore.chainStore.setupWallet(address)
      })
    }
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    // but please inform us what happened
    if (e.message !== 'CHAIN_HAS_CHANGED') {
      logError(e.message)
    }

    rootStore = createRootStore(env)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  // track changes & save to storage
  onSnapshot(
    rootStore,
    ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      navigationStore,
      ...snapshot
    }) => {
      return storage.save(storageKey, snapshot)
    }
  )

  return rootStore
}

import { onSnapshot } from "mobx-state-tree"
import { partition } from "ramda"

import { Environment } from "../environment"
import { RootStoreModel, RootStore } from "./root-store"

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
    data = await storage.load(ROOT_STATE_STORAGE_KEY) || {}
    rootStore = createRootStore(env, data)

    // Setup Authcore
    await rootStore.userStore.authCore.resume()
    rootStore.chainStore.setupWallet(rootStore.userStore.authCore.primaryCosmosAddress)
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    // but please inform us what happened
    logError(e.message)

    rootStore = createRootStore(env)
    await env.setupAuthCore()
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
        creators,
        featuredListLastFetchedDate,
        featuredList, // Never cache
        followedList, // Never cache
        bookmarkList,
      },
      ...snapshot
      /* eslint-enable @typescript-eslint/no-unused-vars */
    }) => {
      const bookmarkURLs = new Set(bookmarkList)
      const [bookmarks, restContents] = partition(c => bookmarkURLs.has(c.url), Object.values(contents))
      return storage.save(ROOT_STATE_STORAGE_KEY, {
        ...snapshot,
        readerStore: {
          contents: restContents
            .sort((a, b) => b.timestamp - a.timestamp)
            // Cache 1,000 contents at max and
            .slice(0, 1000)
            // cache all bookmarks
            .concat(bookmarks)
            .reduce((acc, c) => {
              acc[c.url] = c
              return acc
            }, {}),
          creators,
          featuredListLastFetchedDate,
          bookmarkList,
        }
      })
    }
  )

  return rootStore
}

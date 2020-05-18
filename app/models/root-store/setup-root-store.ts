import { onSnapshot } from "mobx-state-tree"
import { partition } from "ramda"

import { Environment } from "../environment"
import { RootStoreModel, RootStore } from "./root-store"
import {
  handleStatisticsRewardedStoreSnapshot,
  handleStatisticsSupportedStoreSnapshot,
} from "../statistics-store"

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
  env.authCoreAPI.callbacks.unauthenticated = rootStore.handleUnauthenticatedError
  env.authCoreAPI.callbacks.unauthorized = rootStore.handleUnauthenticatedError
  env.likeCoAPI.config.onUnauthenticated = rootStore.handleUnauthenticatedError
  env.likerLandAPI.config.onUnauthenticated = rootStore.handleUnauthenticatedError
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      navigationStore,
      readerStore: {
        contents,
        creators,
        followedList, // Never cache
        bookmarkList,
      },
      statisticsRewardedStore,
      statisticsSupportedStore,
      ...snapshot
    }) => {
      const toBePersistedContentURLs = new Set([].concat(
        bookmarkList,
        followedList.slice(0, 20)
      ))
      const [toBePersistedContents, restContents] = partition(
        c => toBePersistedContentURLs.has(c.url),
        Object.values(contents)
      )
      const snContents = {}
      const snCreators = {}
      restContents
        .sort((a, b) => b.timestamp - a.timestamp)
        // Cache 1,000 contents at max and
        .slice(0, 1000)
        // Cache preferred contents
        .concat(toBePersistedContents)
        .forEach(c => {
          snContents[c.url] = c
          if (creators[c.creator]) {
            snCreators[c.creator] = creators[c.creator]
          }
        })
      return storage.save(ROOT_STATE_STORAGE_KEY, {
        ...snapshot,
        readerStore: {
          contents: snContents,
          creators: snCreators,
          bookmarkList,
        },
        statisticsRewardedStore:
          handleStatisticsRewardedStoreSnapshot(statisticsRewardedStore),
        statisticsSupportedStore:
          handleStatisticsSupportedStoreSnapshot(statisticsSupportedStore),
      })
    }
  )

  return rootStore
}

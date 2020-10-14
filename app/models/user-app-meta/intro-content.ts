import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { IntroContentList } from "../../services/app-config"

import { withEnvironment } from "../extensions"

/**
 * Intro content.
 */
export const IntroContentModel = types
  .model("IntroContent")
  .props({
    /**
     * Current content index
     */
    index: types.optional(types.number, -1),
    /**
     * Last update timestamp
     */
    lastUpdateTs: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .views(self => ({
    get list() {
      return self.getConfig<IntroContentList>(
        "INTRO_CONTENT_SUPERLIKE_ID_LIST",
        [],
      )
    },
  }))
  .views(self => ({
    get current() {
      return self.list[self.index]
    },
  }))
  .actions(self => ({
    increment() {
      if (self.list.length > self.index) {
        self.index += 1
        self.lastUpdateTs = Date.now()
      }
    },
  }))

type IntroContentType = Instance<typeof IntroContentModel>
export interface IntroContent extends IntroContentType {}
type IntroContentSnapshotType = SnapshotOut<typeof IntroContentModel>
export interface IntroContentSnapshot extends IntroContentSnapshotType {}

import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { SupporterListResult } from "../../services/api"
import { logError } from "../../utils/error"

import { withEnvironment, withStatus } from "../extensions"

import { Supporter, SupporterModel } from "../supporter/supporter"

/**
 * Supporters Store
 */
export const SupportersStoreModel = types
  .model("SupportersStore")
  .props({
    items: types.array(SupporterModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .actions(self => {
    return {
      reset() {
        self.items.clear()
      },
      fetch: flow(function*() {
        if (self.status === "pending") return
        self.setStatus("pending")
        try {
          const result: SupporterListResult = yield self.env.likerLandAPI.fetchCurrentUserSupporters()
          if (result.kind === "ok") {
            const supporters: Supporter[] = []
            result.data?.forEach(props => {
              supporters.push(SupporterModel.create({
                likerID: props.id,
                quantity: props.quantity,
                lastEffectiveQuantity: props.lastEffectiveQuantity,
                timestamp: props.ts,
                lastEffectiveTimestamp: props.lastEffectiveTs
              }, self.env))
            })
            self.items.replace(supporters)
          }
        } catch (error) {
          logError(error)
        } finally {
          self.setStatus("done")
        }
      })
    }
  })

type SupportersStoreType = Instance<typeof SupportersStoreModel>
export interface SupportersStore extends SupportersStoreType {}
type SupportersStoreSnapshotType = SnapshotOut<typeof SupportersStoreModel>
export interface SupportersStoreSnapshot extends SupportersStoreSnapshotType {}

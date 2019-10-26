import { observable } from "mobx"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Transfer store
 */
export const TransferStoreModel = types
  .model("TransferStore")
  .extend(self => {
    const targetAddress = observable.box("")
    const amount = observable.box(0)

    const setTargetAddress = (newTargetAddress: string) => {
      targetAddress.set(newTargetAddress)
    }

    const setAmount = (newAmount: number) => {
      amount.set(newAmount)
    }

    const resetInput = () => {
      setTargetAddress("")
      setAmount(0)
    }

    return {
      actions: {
        setTargetAddress,
        setAmount,
        resetInput,
      },
      views: {
        get targetAddress() {
          return targetAddress.get();
        },
        get amount() {
          return amount.get()
        },
      }
    }
  })

type TransferStoreType = Instance<typeof TransferStoreModel>
export interface TransferStore extends TransferStoreType {}
type TransferStoreSnapshotType = SnapshotOut<typeof TransferStoreModel>
export interface TransferStoreSnapshot extends TransferStoreSnapshotType {}

import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { DelegationModel, Delegation } from "../delegation"
import { withEnvironment } from "../extensions"
import { BigNumberPrimitive } from "../number"

/**
 * Wallet model
 */
export const WalletModel = types
  .model("Wallet")
  .props({
    address: types.identifier,
    availableBalance: types.optional(BigNumberPrimitive, "0"),
    delegations: types.map(DelegationModel),
    redelegationTargets: types.map(types.boolean),
  })
  .extend(withEnvironment)
  .actions(self => ({
    setDelegation(delegation: Delegation) {
      self.delegations.put(delegation)
    },
  }))
  .views(self => ({
    get delegationList() {
      return [...self.delegations.values()]
    },
    hasDelegation(validatorAddress: string) {
      return self.delegations.has(validatorAddress)
    },
    canRedelegateFromValidator(validatorAddress: string) {
      return !self.redelegationTargets.get(validatorAddress)
    },
    /**
     * The URL of the account page in block explorer
     */
    get blockExplorerURL() {
      return self.env.mintscan.getAccountURL(self.address)
    },
  }))
  .views(self => ({
    getDelegation(validatorAddress: string, isReadonly = true) {
      if (self.hasDelegation(validatorAddress)) {
        return self.delegations.get(validatorAddress)
      }
      const delegation = DelegationModel.create({ validatorAddress })
      if (!isReadonly) {
        self.setDelegation(delegation)
      }
      return delegation
    },
    get delegatedBalance() {
      return self.delegationList.reduce(
        (total, delegation) => total.plus(delegation.balance),
        new BigNumber(0)
      )
    },
    get unbondingBalance() {
      return self.delegationList.reduce(
        (total, delegation) => total.plus(delegation.unbonding),
        new BigNumber(0)
      )
    },
    get rewardsBalance() {
      return self.delegationList.reduce(
        (total, delegation) => total.plus(delegation.rewards),
        new BigNumber(0)
      )
    },
    get validatorAddressListWithRewards() {
      return self.delegationList
        .filter(d => d.hasRewards)
        .map(d => d.validatorAddress)
    },
    get signer() {
      return self.env.authCoreAPI.getOfflineDirectSigner()
    }
  }))
  .views(self => ({
    get totalBalance() {
      return self.availableBalance
        .plus(self.delegatedBalance)
        .plus(self.rewardsBalance)
        .plus(self.unbondingBalance)
    },
    get hasRewards() {
      return self.rewardsBalance.isGreaterThan(0)
    },
    get hasUnbonding() {
      return self.unbondingBalance.isGreaterThan(0)
    },
  }))

type WalletType = Instance<typeof WalletModel>
export interface Wallet extends WalletType {}
type WalletSnapshotType = SnapshotOut<typeof WalletModel>
export interface WalletSnapshot extends WalletSnapshotType {}

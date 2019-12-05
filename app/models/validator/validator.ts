import {
  Instance,
  SnapshotOut,
  types,
  flow,
  getEnv,
  getParentOfType,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"
import { BigNumberPrimitive } from "../number"
import { WalletStoreModel } from "../wallet-store"

/**
 * A Cosmos validator.
 */
export const ValidatorModel = types
  .model("Validator")
  .props({
    operatorAddress: types.identifier,
    consensusPublicKey: types.string,
    isJailed: types.boolean,
    status: types.number,
    tokens: types.optional(BigNumberPrimitive, "0"),
    totalDelegatorShares: types.optional(BigNumberPrimitive, "0"),

    // Description
    moniker: types.string,
    identity: types.string,
    website: types.string,
    details: types.string,
    avatorURL: types.maybe(types.string),

    unbondingHeight: types.string,
    unbondingTime: types.string,

    // Commission
    commissionRate: types.string,
    maxCommissionRate: types.optional(BigNumberPrimitive, "0"),
    maxCommissionChangeRate: types.string,
    commissionUpdateTime: types.string,

    minSelfDelegation: types.string,

    // Per wallet
    /**
     * Delegation amount of current wallet address
     */
    delegatorShare: types.optional(BigNumberPrimitive, "0"),
    /**
     * Delegation rewards of current wallet address
     */
    delegatorRewards: types.optional(BigNumberPrimitive, "0"),
  })
  .views(self => ({
    get walletStore() {
      return getParentOfType(self, WalletStoreModel)
    },
    get avatar() {
      return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
    },
    get blockExplorerURL() {
      const env: Environment = getEnv(self)
      return env.bigDipper.getValidatorURL(self.operatorAddress)
    },
    get isDelegated() {
      return self.delegatorShare.isGreaterThan(0)
    },
    get hasRewards() {
      return self.delegatorRewards.isGreaterThan(0)
    },
  }))
  .views(self => ({
    /**
     * The share of all provisioned block rewards all delegators of this validator get
     */
    get delegatorProvisionShare() {
      const validatorProvisionShare = self.tokens.div(self.walletStore.totalDelegatorSharesFromAllValidators)
      return validatorProvisionShare.times(new BigNumber(1).minus(self.commissionRate))
    },
  }))
  .views(self => ({
    /**
     * Calculate expected rewards if delegator stakes `x` tokens
     *
     * @param delegatedTokens The delegated tokens of a delegator
     * @return The annual rewards for a delegator
     */
    calculateExpectedRewards(delegatedTokens: BigNumber) {
      const annualAllDelegatorRewards = self.delegatorProvisionShare.times(self.walletStore.annualProvision)
      const annualDelegatorRewardsShare = delegatedTokens.div(self.tokens)
      const annualDelegatorRewards = annualDelegatorRewardsShare.times(annualAllDelegatorRewards)
      return annualDelegatorRewards
    },
    getFormattedDelegatorRewards(decisionPoint?: number) {
      return (self.hasRewards ? "+" : "").concat(self.walletStore.formatDenom(self.delegatorRewards, decisionPoint))
    }
  }))
  .views(self => ({
    get formattedTotalDelegatedShares(): string {
      return self.walletStore.formatDenom(self.totalDelegatorShares, 4)
    },
    get formattedDelegatorShareShort(): string {
      return self.walletStore.formatDenom(self.delegatorShare, 2)
    },
    get formattedDelegatorShare(): string {
      return self.walletStore.formatDenom(self.delegatorShare, 4)
    },
    get formattedDelegatorRewardsShort(): string {
      return self.isDelegated ? self.getFormattedDelegatorRewards(4) : ""
    },
    get formattedDelegatorRewards(): string {
      return self.getFormattedDelegatorRewards(4)
    },
    get formattedVotingPowerInPercent() {
      return self.totalDelegatorShares
        .div(self.walletStore.totalDelegatorSharesFromAllValidators)
        .times(100)
        .toFixed(2)
        .concat("%")
    },
    /**
     * Get simplified expected rewards in percent
     * Ref: https://github.com/luniehq/lunie/blob/ecf75e07c6e673434a87e9e5b2e5e5290c5b1667/src/scripts/returns.js
     *
     * @return The percentage of the returns
     */
    get formattedExpectedReturnsInPercent() {
      const delegatedTokens = new BigNumber(1e10)
      return self.calculateExpectedRewards(delegatedTokens)
        .div(delegatedTokens)
        .times(100)
        .toFixed(2)
        .concat("%")
    },
  }))
  .actions(self => ({
    update(v: Validator) {
      self.operatorAddress = v.operatorAddress
      self.consensusPublicKey = v.consensusPublicKey
      self.isJailed = v.isJailed
      self.status = v.status
      self.tokens = v.tokens
      self.totalDelegatorShares = v.totalDelegatorShares

      self.moniker = v.moniker
      self.identity = v.identity
      self.website = v.website
      self.details = v.details

      if (v.avatorURL) {
        self.avatorURL = v.avatorURL
      }
      self.unbondingHeight = v.unbondingHeight
      self.unbondingTime = v.unbondingTime

      self.commissionRate = v.commissionRate
      self.maxCommissionRate = v.maxCommissionRate
      self.maxCommissionChangeRate = v.maxCommissionChangeRate
      self.commissionUpdateTime = v.commissionUpdateTime
      self.minSelfDelegation = v.minSelfDelegation
    },
    setDelegatorRewards: (amount: string) => {
      self.delegatorRewards = new BigNumber(amount)
    },
    setDelegatorShare: (shares: string) => {
      self.delegatorShare = new BigNumber(shares)
    },
    fetchAvatarURL: flow(function * () {
      if (self.identity.length === 16) {
        const response: Response = yield fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${self.identity}&fields=pictures`, {
          method: 'GET',
        })
        if (response.status === 200) {
          const { them }: any = yield response.json()
          console.tron.log("identity", self.identity)
          const url = them && them.length && them[0].pictures && them[0].pictures.primary && them[0].pictures.primary.url
          if (/^https?:\/\//.test(url)) {
            self.avatorURL = url
          }
        }
      }
    }),
  }))

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}

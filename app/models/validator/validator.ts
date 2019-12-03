import {
  Instance,
  SnapshotOut,
  types,
  flow,
  getEnv,
} from "mobx-state-tree"
import { observable } from "mobx"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"

/**
 * A Cosmos validator.
 */
export const ValidatorModel = types
  .model("Validator")
  .props({
    operatorAddress: types.identifier,
    consensusPubkey: types.string,
    jailed: types.boolean,
    status: types.number,
    tokens: types.string,
    totalDelegatorShares: types.string,

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
    maxCommissionRate: types.string,
    maxCommissionChangeRate: types.string,
    commissionUpdateTime: types.string,

    minSelfDelegation: types.string,
  })
  .extend(self => {
    const env: Environment = getEnv(self)

    /**
     * Delegation amount of current wallet address
     */
    const delegatorShare = observable.box("0")

    /**
     * Delegation rewards of current wallet address
     */
    const delegatorRewards = observable.box("0")

    const setDelegatorRewards = (amount: string) => {
      delegatorRewards.set(amount)
    }

    const setDelegatorShare = (shares: string) => {
      delegatorShare.set(shares)
    }

    const fetchAvatarURL = flow(function * () {
      if (self.identity.length === 16) {
        const response: Response = yield fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${self.identity}&fields=pictures`, {
          method: 'GET',
        })
        if (response.status === 200) {
          const { them }: any = yield response.json()
          self.avatorURL = them && them.length && them[0].pictures && them[0].pictures.primary && them[0].pictures.primary.url
        }
      }
    })

    /**
     * Calculate share of all provisioned block rewards all delegators of this validator get
     *
     * @param totalStakedTokens The total staked tokens from all validators
     */
    function calculateDelegatorProvisionShare(totalStakedTokens: BigNumber) {
      const validatorProvisionShare = new BigNumber(self.tokens).div(totalStakedTokens)
      return validatorProvisionShare.times(new BigNumber(1).minus(new BigNumber(self.commissionRate)))
    }

    /**
     * Calculate expected rewards if delegator stakes `x` tokens
     *
     * @param totalStakedTokens The total staked tokens from all validators
     * @param annualProvision The annual provision
     * @param delegatedTokens The delegated tokens of a delegator
     * @return The annual rewards for a delegator
     */
    function calculateExpectedRewards(
      totalStakedTokens: BigNumber,
      annualProvision: BigNumber,
      delegatedTokens: BigNumber,
    ) {
      const delegatorProvisionShare = calculateDelegatorProvisionShare(totalStakedTokens)
      const annualAllDelegatorRewards = delegatorProvisionShare.times(annualProvision)
      const annualDelegatorRewardsShare = delegatedTokens.div(new BigNumber(self.tokens))
      const annualDelegatorRewards = annualDelegatorRewardsShare.times(annualAllDelegatorRewards)
      return annualDelegatorRewards
    }

    /**
     * Get simplified expected rewards in percent
     * Ref: https://github.com/luniehq/lunie/blob/ecf75e07c6e673434a87e9e5b2e5e5290c5b1667/src/scripts/returns.js
     *
     * @param totalStakedTokens The total staked tokens from all validators
     * @param annualProvision The annual provision
     * @return The percentage of the returns
     */
    function calculateExpectedReturnsInPercent(
      totalStakedTokens: string,
      annualProvision: string,
    ) {
      let delegatedTokens = new BigNumber(delegatorShare.get())
      if (delegatedTokens.isZero()) {
        delegatedTokens = new BigNumber(10000000000)
      }
      return (
        calculateExpectedRewards(
          new BigNumber(totalStakedTokens),
          new BigNumber(annualProvision),
          delegatedTokens,
        )
          .div(delegatedTokens)
          .times(100)
      )
    }

    return {
      views: {
        get avatar() {
          return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
        },
        get blockExplorerURL() {
          return env.bigDipper.getValidatorURL(self.operatorAddress)
        },
        get delegatorRewards() {
          return delegatorRewards.get()
        },
        get delegatorShare() {
          return delegatorShare.get()
        },
        get isDelegated() {
          return delegatorShare.get() !== "0"
        },
        getExpectedReturnsInPercent(totalStakedTokens: string, annualProvision: string) {
          return calculateExpectedReturnsInPercent(totalStakedTokens, annualProvision).toFixed()
        },
      },
      actions: {
        fetchAvatarURL,
        setDelegatorRewards,
        setDelegatorShare,
      },
    }
  })

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}

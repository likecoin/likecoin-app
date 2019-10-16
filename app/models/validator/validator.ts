import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"

import { BigDipper } from "../../services/big-dipper"

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
    delegatorShares: types.string,

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
    expectedReturns: types.optional(types.number, 0),

    minSelfDelegation: types.string,
  })
  .extend(self => {
    const fetchAvatarURL = flow(function * () {
      if (self.identity.length == 16) {
        const response: Response = yield fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${self.identity}&fields=pictures`, {
          method: 'GET',
        })
        if (response.status === 200) {
          const { them }: any = {} = yield response.json()
          self.avatorURL = them && them.length && them[0].pictures && them[0].pictures.primary && them[0].pictures.primary.url
        }
      }
    })

    /**
     * Share of all provisioned block rewards all delegators of this validator get
     *
     * @param totalStakedTokens The total staked tokens from all validators
     */
    const getProvisionShare = (totalStakedTokens: number) => {
      const validatorProvisionShare = Number.parseFloat(self.tokens) / totalStakedTokens
      const delegatorProvisionShare = validatorProvisionShare * (1 - Number.parseFloat(self.commissionRate))
      return delegatorProvisionShare
    }

    /**
     * Expected rewards if delegator stakes x tokens
     * 
     * @param totalStakedTokens The total staked tokens from all validators
     * @param annualProvision The number of annual provisioned tokens
     * @param delegatedTokens The number of delegated tokens
     */
    const getExpectedRewards = (
      totalStakedTokens: number,
      annualProvision: number,
      delegatedTokens: number,
    ) => {
      if (self.status === 0 || self.jailed === true) {
        return 0
      }
      const delegatorProvisionShare = getProvisionShare(totalStakedTokens)
      const annualAllDelegatorRewards = delegatorProvisionShare * annualProvision
      const annualDelegatorRewardsShare = delegatedTokens / Number.parseFloat(self.tokens)
      const annualDelegatorRewards = annualDelegatorRewardsShare * annualAllDelegatorRewards
      return annualDelegatorRewards
    }

    /**
     * Get simplified expected rewards with a fixed token amount
     * 
     * @param totalStakedTokens The total staked tokens from all validators
     * @param annualProvision The annual provision
     */
    const setExpectedReturns = (
      totalStakedTokens: number,
      annualProvision: number
    ) => {
      self.expectedReturns = getExpectedRewards(
        totalStakedTokens,
        annualProvision,
        1
      )
    }

    return {
      views: {
        get avatar() {
          return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
        },
        get blockExplorerURL() {
          return BigDipper.getValidatorURL(self.operatorAddress)
        },
      },
      actions: {
        fetchAvatarURL,
        setExpectedReturns,
      },
    }
  })

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}

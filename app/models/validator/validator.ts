import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"

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

    minSelfDelegation: types.string,
  })
  .views(self => ({
    get avatar() {
      return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
    },
    get commissionRatePercent() {
      return Number.parseFloat(self.commissionRate).toLocaleString("en-US", { style: "percent" })
    },
  }))
  .actions(self => ({
    fetchAvatarURL: flow(function * () {
      if (self.identity.length == 16){
        const response: Response = yield fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${self.identity}&fields=pictures`, {
          method: 'GET',
        })
        if (response.status === 200) {
          const { them }: any = {} = yield response.json()
          self.avatorURL = them && them.length && them[0].pictures && them[0].pictures.primary && them[0].pictures.primary.url;
        }
      }
    }),
  }))

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}

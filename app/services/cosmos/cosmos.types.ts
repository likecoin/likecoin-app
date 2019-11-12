import { Buffer } from "buffer"

export interface CosmosCoinResult {
  denom: string
  amount: string
}

export interface CosmosAccountResult {
  /* eslint-disable camelcase */
  address?: string
  coins: CosmosCoinResult[]
  public_key?: string
  account_number: string
  sequence: string
  /* eslint-enable camelcase */
}

export interface CosmosValidator {
  /* eslint-disable camelcase */
  operator_address: string
  consensus_pubkey: string
  jailed: boolean
  status: number
  tokens: string
  delegator_shares: string
  description: {
    moniker: string
    identity: string
    website: string
    details: string
  }
  unbonding_height: string
  unbonding_time: string
  commission: {
    commission_rates: {
      rate: string
      max_rate: string
      max_change_rate: string
    }
    update_time: string
  }
  min_self_delegation: string
  /* eslint-enable camelcase */
}

export interface CosmosSendResult {
  hash: string
  sequence: any
  included: () => Promise<any>
}

export interface CosmosSignature {
  signature: Buffer
  publicKey: Buffer
}

export interface CosmosMessage {
  message: any
  simulate: ({ memo }: {
    memo?: any
  }) => Promise<number>
  send: (
    meta: {
      gas: any
      gasPrices?: any
      memo?: any
    },
    signer: (
      signMessage: string,
    ) => CosmosSignature
  ) => Promise<CosmosSendResult>
}

export interface CosmosDelegation {
  /* eslint-disable camelcase */
  delegator_address: string
  validator_address: string
  shares: string
  height: number
  /* eslint-enable camelcase */
}

export interface CosmosValidatorReward {
  /* eslint-disable-next-line camelcase */
  validator_address: string
  reward?: CosmosCoinResult[]
}

export interface CosmosRewardsResult {
  rewards: CosmosValidatorReward[]
  total: CosmosCoinResult[]
}

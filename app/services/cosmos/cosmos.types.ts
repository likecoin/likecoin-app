export interface CosmosCoinResult {
  denom: string
  amount: string
}

export interface CosmosAccountResult {
  address?: string
  coins: Array<CosmosCoinResult>
  public_key?: string
  account_number: string
  sequence: string
}

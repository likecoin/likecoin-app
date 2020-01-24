import { NavigationScreenProps } from "react-navigation"

import { ChainStore } from "../../models/chain-store"

import { StakingRedelegationStore as TxStore } from "../../models/staking-redelegation-store"

export interface StakingRedelegationValidatorInputScreenParams {
  from: string
}

export interface StakingRedelegationValidatorInputScreenProps extends NavigationScreenProps<StakingRedelegationValidatorInputScreenParams> {
  txStore: TxStore,
  chain: ChainStore,
}

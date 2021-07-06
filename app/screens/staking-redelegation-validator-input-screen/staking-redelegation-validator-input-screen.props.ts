import { NavigationStackScreenProps } from "react-navigation-stack"

import { ChainStore } from "../../models/chain-store"

import { StakingRedelegationStore as TxStore } from "../../models/staking-redelegation-store"

export interface StakingRedelegationValidatorInputScreenParams {
  from: string
}

export interface StakingRedelegationValidatorInputScreenProps extends NavigationStackScreenProps<StakingRedelegationValidatorInputScreenParams> {
  txStore: TxStore,
  chain: ChainStore,
}

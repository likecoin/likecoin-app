import { NavigationStackScreenProps } from "react-navigation-stack"

import { ChainStore } from "../../models/chain-store"
import { StakingRedelegationStore } from "../../models/staking-redelegation-store"

export interface StakingRedelegationAmountInputScreenProps extends NavigationStackScreenProps {
  txStore: StakingRedelegationStore
  chain: ChainStore
}

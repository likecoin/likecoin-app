import { NavigationScreenProps } from "react-navigation"

import { ChainStore } from "../../models/chain-store"
import { StakingRedelegationStore } from "../../models/staking-redelegation-store"

export interface StakingRedelegationAmountInputScreenProps extends NavigationScreenProps {
  txStore: StakingRedelegationStore
  chain: ChainStore
}

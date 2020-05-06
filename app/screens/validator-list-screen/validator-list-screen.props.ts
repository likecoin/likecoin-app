import { NavigationScreenProps } from "react-navigation"

import { ChainStore } from "../../models/chain-store"

export interface ValidatorListScreenProps extends NavigationScreenProps {
  chain: ChainStore
}

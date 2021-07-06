import { NavigationStackScreenProps } from "react-navigation-stack"

import { ChainStore } from "../../models/chain-store"

export interface ValidatorListScreenProps extends NavigationStackScreenProps {
  chain: ChainStore
}

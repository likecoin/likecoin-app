import { NavigationScreenProps } from "react-navigation"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"

export interface WalletDashboardScreenProps extends NavigationScreenProps {
  chain: ChainStore
  userStore: UserStore
}

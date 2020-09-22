import { NavigationScreenProps } from "react-navigation"

import { CreatorsStore } from "../../models/creators-store"

export interface FollowSettingsScreenProps extends NavigationScreenProps<{}> {
  creatorsStore: CreatorsStore,
}

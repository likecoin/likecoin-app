import { NavigationStackScreenProps } from "react-navigation-stack"

import { CreatorsStore } from "../../models/creators-store"

export interface FollowSettingsScreenProps extends NavigationStackScreenProps<{}> {
  creatorsStore: CreatorsStore,
}

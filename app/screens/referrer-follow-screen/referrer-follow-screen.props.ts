import { NavigationStackScreenProps } from "react-navigation-stack"

import { Creator } from "../../models/creator"

interface ReferrerFollowScreenNavigationParams {
  referrer: Creator
}

export interface ReferrerFollowScreenProps
  extends NavigationStackScreenProps<ReferrerFollowScreenNavigationParams> {}

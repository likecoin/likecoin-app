import { NavigationScreenProps } from "react-navigation"

import { Creator } from "../../models/creator"

interface ReferrerFollowScreenNavigationParams {
  referrer: Creator
}

export interface ReferrerFollowScreenProps
  extends NavigationScreenProps<ReferrerFollowScreenNavigationParams> {}

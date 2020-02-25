import { FollowSettingsTabType } from "./follow-settings-screen.type"

import { Creator } from "../../models/creator"

export interface FollowSettingsListItemProps {
  type: FollowSettingsTabType

  creator: Creator

  onPressFollow?: (creator: Creator) => void
  onPressUnfollow?: (creator: Creator) => void
}

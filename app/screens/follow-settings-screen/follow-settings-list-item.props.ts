import { FollowSettingsTabType } from "./follow-settings-screen.type"

import { Creator } from "../../models/creator"

import { TableViewCellProps } from "../../components/table-view"

export interface FollowSettingsListItemProps extends TableViewCellProps {
  type: FollowSettingsTabType

  creator: Creator

  onPressFollow?: (creator: Creator) => void
  onPressUnfollow?: (creator: Creator) => void
}

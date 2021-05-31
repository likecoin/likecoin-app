import * as React from "react"
import { ViewStyle } from "react-native"
import { observer } from "mobx-react"
import styled from "styled-components/native"
import ActionSheet from "react-native-actions-sheet"

import { Avatar } from "../../components/avatar"
import { TableViewCell as TableViewCellBase } from "../../components/table-view/table-view-cell"
import {
  ActionSheetButton,
  ActionSheetButtonTitle,
  ContentListItemActionSheet,
} from "../../components/content-list-item"

import { FollowSettingsListItemProps as Props } from "./follow-settings-list-item.props"

const TableViewCell = styled(TableViewCellBase)`
  padding-top: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

const actionSheetContainerStyle: ViewStyle = {
  backgroundColor: "transparent"
}

@observer
export class FollowingSettingsListItem extends React.Component<Props> {
  actionSheetRef = React.createRef<ActionSheet>()

  state = {
    isShowUnfollowButton: false,
  }

  componentDidMount() {
    if (!this.props.creator.hasFetchedDetails) {
      this.props.creator.fetchDetails()
    }
  }

  private onPress = () => {
    this.actionSheetRef?.current?.show()
  }

  private onPressFollow = () => {
    this.actionSheetRef?.current?.hide()
    if (this.props.onPressFollow) {
      this.props.onPressFollow(this.props.creator)
    }
  }

  private onPressUnfollow = () => {
    this.actionSheetRef?.current?.hide()
    if (this.props.onPressUnfollow) {
      this.props.onPressUnfollow(this.props.creator)
    }
  }

  render() {
    const { creator, isFirstCell, isLastCell } = this.props
    return (
      <React.Fragment>
        <TableViewCell
          title={`${creator.displayName || creator.likerID}`}
          append={(
            <Avatar
              src={creator.avatarURL}
              isCivicLiker={creator.isCivicLiker}
              size={28}
            />
          )}
          accessoryIcon="more"
          isFirstCell={isFirstCell}
          isLastCell={isLastCell}
          onPress={this.onPress}
        />
        <ActionSheet
          ref={this.actionSheetRef}
          containerStyle={actionSheetContainerStyle}
        >
          <ContentListItemActionSheet>
            {this.props.type === "follow" ? (
              <ActionSheetButton onPress={this.onPressUnfollow}>
                <ActionSheetButtonTitle tx="common.unfollow" />
              </ActionSheetButton>
            ) : (
              <ActionSheetButton onPress={this.onPressFollow}>
                <ActionSheetButtonTitle tx="common.follow" />
              </ActionSheetButton>
            )}
          </ContentListItemActionSheet>
        </ActionSheet>
      </React.Fragment>
    )
  }
}

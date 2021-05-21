import * as React from "react"
import { observer } from "mobx-react"

import { Content } from "../../models/content"

import {
  ActionSheetButton,
  ActionSheetButtonTitle,
  ContentListItemActionSheet,
} from "./content-list-item-action-sheet"

export interface PureBookmarkedContentListItemActionSheetProps {
  isArchived?: boolean
  onRemove?: () => void
  onToggleArchive?: () => void
}

function PureBookmarkedContentListItemActionSheet(
  props: PureBookmarkedContentListItemActionSheetProps,
) {
  const archiveButtonTitleTx = props.isArchived
    ? "ContentListItem.Back.Unarchive"
    : "ContentListItem.Back.Archive"
  return (
    <ContentListItemActionSheet>
      <ActionSheetButton onPress={props.onToggleArchive}>
        <ActionSheetButtonTitle tx={archiveButtonTitleTx} />
      </ActionSheetButton>
      <ActionSheetButton onPress={props.onRemove}>
        <ActionSheetButtonTitle tx="ContentListItem.Back.Remove" />
      </ActionSheetButton>
    </ContentListItemActionSheet>
  )
}

export interface BookmarkedContentListItemActionSheetProps {
  item: Content
  onRemove?: (content: Content) => void
  onToggleArchive?: (content: Content) => void
  onTriggerAction?: () => void
}

@observer
export class BookmarkedContentListItemActionSheet extends React.Component<
  BookmarkedContentListItemActionSheetProps,
  {}
> {
  private triggerAction = () => {
    if (this.props.onTriggerAction) {
      this.props.onTriggerAction()
    }
  }

  private onRemove = () => {
    if (this.props.onRemove && this.props.item) {
      this.props.onRemove(this.props.item)
    }
    this.triggerAction()
  }

  private onToggleArchive = () => {
    if (this.props.onToggleArchive && this.props.item) {
      this.props.onToggleArchive(this.props.item)
    }
    this.triggerAction()
  }

  render() {
    return (
      <PureBookmarkedContentListItemActionSheet
        isArchived={this.props.item.isArchived}
        onRemove={this.onRemove}
        onToggleArchive={this.onToggleArchive}
      />
    )
  }
}

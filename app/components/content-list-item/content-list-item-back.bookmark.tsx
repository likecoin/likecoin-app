import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"

import { Content } from "../../models/content"

import { ContentListItemBackStyle as Style } from "./content-list-item-back.style"
import { ContentListItemBackButton as BackButton } from "./content-list-item-back-button"

export interface PureBookmarkedContentListItemBackProps {
  isArchived?: boolean
  onRemove?: () => void
  onToggleArchive?: () => void
}

function PureBookmarkedContentListItemBack(
  props: PureBookmarkedContentListItemBackProps,
) {
  return (
    <View style={Style.Root}>
      {props.isArchived ? (
        <BackButton
          preset="primary"
          tx="ContentListItem.Back.Unarchive"
          icon="unarchive"
          onPress={props.onToggleArchive}
        />
      ) : (
        <BackButton
          preset="secondary"
          tx="ContentListItem.Back.Archive"
          icon="archive"
          onPress={props.onToggleArchive}
        />
      )}
      <BackButton
        preset="neutral"
        tx="ContentListItem.Back.Remove"
        icon="unbookmark"
        onPress={props.onRemove}
      />
    </View>
  )
}

export interface BookmarkedContentListItemBackProps {
  item: Content
  onRemove?: (content: Content) => void
  onToggleArchive?: (content: Content) => void
  onTriggerAction?: () => void
}

@observer
export class BookmarkedContentListItemBack extends React.Component<
  BookmarkedContentListItemBackProps,
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
      <PureBookmarkedContentListItemBack
        isArchived={this.props.item.isArchived}
        onRemove={this.onRemove}
        onToggleArchive={this.onToggleArchive}
      />
    )
  }
}

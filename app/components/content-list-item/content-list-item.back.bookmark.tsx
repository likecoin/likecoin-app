import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { observer } from "mobx-react"

import { Content } from "../../models/content"

import { Text } from "../text"

import {
  ContentListItemBackStyle as Style,
  ICON_PROPS,
} from "./content-list-item.back.style"

import { ArchiveIcon, UnbookmarkIcon, UnarchiveIcon } from "./icons"

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
        <TouchableOpacity
          style={Style.ButtonPrimary}
          onPress={props.onToggleArchive}
        >
          <UnarchiveIcon
            color={Style.ButtonPrimaryTitle.color}
            {...ICON_PROPS}
          />
          <Text
            tx="ContentListItem.Back.Unarchive"
            style={Style.ButtonPrimaryTitle}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={Style.ButtonSecondary}
          onPress={props.onToggleArchive}
        >
          <ArchiveIcon
            color={Style.ButtonSecondaryTitle.color}
            {...ICON_PROPS}
          />
          <Text
            tx="ContentListItem.Back.Archive"
            style={Style.ButtonSecondaryTitle}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={Style.ButtonNeutral} onPress={props.onRemove}>
        <UnbookmarkIcon
          color={Style.ButtonPrimaryTitle.color}
          {...ICON_PROPS}
        />
        <Text
          tx="ContentListItem.Back.Remove"
          style={Style.ButtonPrimaryTitle}
        />
      </TouchableOpacity>
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

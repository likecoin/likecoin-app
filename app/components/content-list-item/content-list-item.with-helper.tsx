import React from "react"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"

import { Button } from "../button"

import { ContentListItemStyle as Style } from "./content-list-item.style"

export interface WithContentListItemHelperProps {
  onPressMoreButton?: () => void
  renderMoreButton?: () => React.ComponentType
  fetchCreatorDetails?: (content: Creator) => Promise<void>
  fetchContentDetails?: (content: Content) => Promise<void>
}

export const withContentListItemHelper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) =>
  class WithContentListItemHelper extends React.Component<
    P & WithContentListItemHelperProps
  > {
    private async fetchCreatorDetails(creator: Creator) {
      if (creator?.checkShouldFetchDetails()) {
        await creator.fetchDetails()
      }
    }
  
    private async fetchContentDetails(content: Content) {
      if (content?.checkShouldFetchDetails()) {
        const promise = content.fetchDetails()
        if (!content.creator) {
          await promise
        }
      }
      await this.fetchCreatorDetails(content?.creator)
    }

    private renderMoreButton = () => (
      <Button
        preset="plain"
        icon="three-dot-horizontal"
        size="tiny"
        color="grey4a"
        style={Style.MoreButton}
        onPress={this.props.onPressMoreButton}
      />
    )

    render() {
      const { ...props } = this.props
      return (<WrappedComponent
        {...(props as P)}
          renderMoreButton={this.renderMoreButton}
          fetchCreatorDetails={this.fetchCreatorDetails}
          fetchContentDetails={this.fetchContentDetails}
        />
      )
    }
  }

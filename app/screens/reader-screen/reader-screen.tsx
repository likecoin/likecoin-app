import * as React from "react"
import { View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react";

import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { ContentListItem } from "../../components/content-list-item"

import { color, spacing } from "../../theme"

import { ReaderStore } from "../../models/reader-store"
import { Content } from "../../models/content"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}

export interface ReaderScreenProps extends NavigationScreenProps<{}> {
  readerStore: ReaderStore,
}

@inject("readerStore")
@observer
export class ReaderScreen extends React.Component<ReaderScreenProps, {}> {
  componentDidMount() {
    switch (this.props.navigation.state.routeName) {
      case 'Featured':
        this.props.readerStore.fetchSuggestList()
        break
      
      case 'Followed':
        this.props.readerStore.fetchFollowedList()
        break
    }
  }

  _onPressContentItem = (content: Content) => {
    this.props.navigation.navigate('ContentView', { content })
  }

  _renderContent = (content: Content) => (
    <ContentListItem
      key={content.url}
      content={content}
      onPressItem={this._onPressContentItem}
    />
  )

  render() {
    const { readerStore } = this.props

    let contentList = []
    switch (this.props.navigation.state.routeName) {
      case 'Featured':
        contentList = readerStore.featuredList
        break
      case 'Followed':
        contentList = readerStore.followedList
        break
    }
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          style={CONTAINER}
          preset="scroll"
          backgroundColor={color.transparent}
          unsafe={true}
        >
          {contentList.map(this._renderContent)}
        </Screen>
      </View>
    )
  }
}

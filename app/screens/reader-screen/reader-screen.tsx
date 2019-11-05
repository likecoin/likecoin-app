import * as React from "react"
import { View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ContentListItem } from "../../components/content-list-item"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { ReaderStore } from "../../models/reader-store"
import { Content } from "../../models/content"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flexGrow: 1,
  alignItems: "stretch",
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
}
const EMPTY_VIEW: ViewStyle = {
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
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
    let titleLabelTx = ""
    switch (this.props.navigation.state.routeName) {
      case "Featured":
        contentList = readerStore.featuredList
        titleLabelTx = "readerScreen.featuredLabel"
        break
      case "Followed":
        contentList = readerStore.followedList
        titleLabelTx = "readerScreen.followingLabel"
        break
    }
  
    return (
      <View style={FULL}>
        <Screen
          style={CONTAINER}
          preset={contentList.length ? "scroll" : "fixed"}
          backgroundColor={color.palette.white}
          unsafe={true}
        >
          <Text
            tx={titleLabelTx}
            color="likeGreen"
            align="center"
            weight="600"
          />
          {contentList.length > 0 ? (
            contentList.map(this._renderContent)
          ) : (
            this.renderEmpty()
          )}
        </Screen>
      </View>
    )
  }

  private renderEmpty = () => {
    return (
      <View style={EMPTY_VIEW}>
        <Text
          tx="readerScreen.emptyLabel"
          color="grey9b"
          size="large"
          align="center"
          weight="600"
        />
      </View>
    )
  }
}

import * as React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView } from "react-native-webview";

import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper";
import { Header } from "../../components/header";
import { Content } from "../../models/content";
import { color, spacing } from "../../theme"

const FULL: ViewStyle = { flex: 1 }
const TITLE: TextStyle = { marginHorizontal: spacing[4] }

export interface ContentViewNavigationStateParams {
  content: Content
}
export interface ContentViewScreenProps extends NavigationScreenProps<ContentViewNavigationStateParams> {}

export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
  componentWillUnmount() {
    // Update like count incase user has liked the content
    const { content } = this.props.navigation.state.params
    content.fetchLikeStat()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { content } = this.props.navigation.state.params
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          preset="fixed"
          backgroundColor={color.transparent}>
          <Header
            titleStyle={TITLE}
            headerText={content.title}
            leftIcon="back"
            onLeftPress={this._goBack}
          />
          <WebView
            style={FULL}
            sharedCookiesEnabled={true}
            source={{ uri: content.url }}
          />
        </Screen>
      </View>
    )
  }
}

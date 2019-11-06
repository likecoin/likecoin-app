import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView } from "react-native-webview"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { Content } from "../../models/content"

import { color } from "../../theme"

const FULL: ViewStyle = { flex: 1 }

export interface ContentViewNavigationStateParams {
  content: Content
}
export interface ContentViewScreenProps extends NavigationScreenProps<ContentViewNavigationStateParams> {}

export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
  componentDidMount() {
    const { content } = this.props.navigation.state.params
    if (!content.hasFetchedDetails) {
      content.fetchDetails()
    }
  }

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
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
        style={FULL}
      >
        <Header
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
    )
  }
}

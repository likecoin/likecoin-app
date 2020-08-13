import * as React from "react"
import { Platform, Share, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView } from "react-native-webview"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { Content } from "../../models/content"

import { color } from "../../theme"
import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

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
    if (content.shouldFetchLikeStat) {
      content.fetchLikeStat()
    }
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private onShare = async () => {
    const { url } = this.props.navigation.state.params.content
    logAnalyticsEvent('share', { contentType: 'content', itemId: url })
    try {
      await Share.share(Platform.OS === "ios" ? { url } : { message: url })
    } catch (error) {
      logError(error.message)
    }
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
          headerText={content.normalizedTitle}
          leftIcon="close"
          rightIcon="share"
          onLeftPress={this.goBack}
          onRightPress={this.onShare}
        />
        <WebView
          style={FULL}
          sharedCookiesEnabled={true}
          source={{ uri: content.url }}
          decelerationRate={0.998}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
      </Screen>
    )
  }
}

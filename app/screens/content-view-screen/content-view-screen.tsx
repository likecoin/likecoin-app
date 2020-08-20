import * as React from "react"
import { Platform, Share, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView } from "react-native-webview"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { Content } from "../../models/content"
import { SuperLike } from "../../models/super-like"

import { color } from "../../theme"
import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

const FULL: ViewStyle = { flex: 1 }

export interface ContentViewNavigationStateParams {
  content?: Content
  superLike?: SuperLike
}
export interface ContentViewScreenProps extends NavigationScreenProps<ContentViewNavigationStateParams> {}

export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
  componentDidMount() {
    if (!this.content.hasFetchedDetails) {
      this.content.fetchDetails()
    }
  }

  componentWillUnmount() {
    // Update like count incase user has liked the content
    if (this.content.shouldFetchLikeStat) {
      this.content.fetchLikeStat()
    }
  }

  get content() {
    const { content, superLike } = this.props.navigation.state.params
    return superLike ? superLike.content : content
  }

  get url() {
    const { content, superLike } = this.props.navigation.state.params
    return superLike ? superLike.redirectURL : content.url
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private onShare = async () => {
    const { url } = this
    logAnalyticsEvent('share', { contentType: 'content', itemId: url })
    try {
      await Share.share(Platform.OS === "ios" ? { url } : { message: url })
    } catch (error) {
      logError(error.message)
    }
  }

  render() {
    const { content, url } = this
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
          source={{ uri: url }}
          decelerationRate={0.998}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
      </Screen>
    )
  }
}

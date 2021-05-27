import * as React from "react"
import { observer } from "mobx-react"
import { ActivityIndicator, Platform, Share, StatusBar, StyleSheet } from "react-native"
import { NavigationScreenProps, SafeAreaView } from "react-navigation"
import { WebView as WebViewBase, WebViewMessageEvent } from "react-native-webview"
import styled from "styled-components/native"

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { LikeCoinButton as LikeCoinButtonBase } from "../../components/likecoin-button"

import { Content } from "../../models/content"
import { SuperLike } from "../../models/super-like"

import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

const RootView = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`

const HeaderView = styled.View`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ContentView = styled.View`
  flex: 1;
`

const WebView = styled(WebViewBase)`
  flex: 1;
`

const FooterView = styled.SafeAreaView`
  border-top-width: ${StyleSheet.hairlineWidth};
  border-top-color: ${({ theme }) => theme.color.separator};
`

const FooterInnerView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.md};
`

const LikeCoinButton = styled(LikeCoinButtonBase)`
  margin-top: -${({ theme }) => theme.spacing.sm};
`

export interface ContentViewNavigationStateParams {
  content?: Content
  superLike?: SuperLike
}
export interface ContentViewScreenProps extends NavigationScreenProps<ContentViewNavigationStateParams> {}

const injectedJavaScript = `${
  /* Forward any post messages to WebView */ ""
  }window.addEventListener('message', function(event) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
  });
  true;${/* NOTE: This is required, or you'll sometimes get silent failures */ ""}`

@observer
export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
  webViewRef = React.createRef<WebViewBase>()

  componentDidMount() {
    this.content.read()
    if (this.content.checkShouldFetchDetails()) {
      this.content.fetchDetails()
    }
    this.content.fetchCurrentUserLikeStat()
    this.content.fetchCurrentUserSuperLikeStat()
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

  private onPressLike = (hits: number) => {
    this.content.like(hits)
  }

  private onPressSuperLike = () => {
    this.content.superLike()
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

  private onToggleBookmark = () => {
    if (!this.content?.isBookmarked) {
      this.content?.addBookmark()
    } else {
      this.content?.removeBookmark()
    }
  }

  private handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const { action } = JSON.parse(event.nativeEvent?.data)
      switch (action) {
        case "MOUNTED":
          this.webViewRef?.current?.injectJavaScript(`
            ${
            // HACK:
            // Since As we cannot determine which iframe(s) contain LikeCoin button,
            // so we loop through and post message to all iframes
            ""}
            for (let i=0; i < window.frames.length; i+=1) {
              let frame = frames[i];
              frame.postMessage({ action: "DISABLE_BUTTON" }, '${this.content.getConfig('LIKECOIN_BUTTON_BASE_URL')}');
            }
          `)
          break
        default:
          break
      }
    } catch (error) {
      if (error instanceof SyntaxError) return
      logError(error)
    }
  }

  private renderBookmarkButton() {
    const iconName = this.content?.isBookmarked ? "bookmark-filled" : "bookmark-outlined"
    if (this.content?.isUpdatingBookmark) {
      return (
        <Button
          preset="plain"
          size="default"
          disabled={true}
        >
          <ActivityIndicator size="small" />
        </Button>
      )
    }
    return (
      <Button
        preset="plain"
        size="default"
        icon={iconName}
        onPress={this.onToggleBookmark}
      />
    )
  }

  render() {
    const { content, url } = this
    return (
      <RootView>
        <HeaderView>
          <SafeAreaView>
            <StatusBar barStyle="light-content" />
            <Header
              headerText={content?.normalizedTitle}
              leftIcon="close"
              onLeftPress={this.goBack}
            />
          </SafeAreaView>
        </HeaderView>
        <ContentView>
          <WebView
            ref={this.webViewRef}
            sharedCookiesEnabled={true}
            source={{ uri: url }}
            decelerationRate={0.998}
            // TODO: remove HACK after applicationNameForUserAgent type is fixed
            {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
            onMessage={this.handleWebViewMessage}
          />
        </ContentView>
        <FooterView>
          <FooterInnerView>
            <LikeCoinButton
              size={48}
              likeCount={content?.currentUserLikeCount}
              isSuperLikeEnabled={content?.isCurrentUserSuperLiker}
              canSuperLike={content?.canCurrentUserSuperLike}
              hasSuperLiked={content?.hasCurrentUserSuperLiked}
              cooldownValue={content?.currentUserSuperLikeCooldown}
              cooldownEndTime={content?.currentUserSuperLikeCooldownEndTime}
              onPressLike={this.onPressLike}
              onPressSuperLike={this.onPressSuperLike}
            />
            {this.renderBookmarkButton()}
            <Button
              preset="plain"
              size="default"
              icon="share"
              onPress={this.onShare}
            />
          </FooterInnerView>
        </FooterView>
      </RootView>
    )
  }
}

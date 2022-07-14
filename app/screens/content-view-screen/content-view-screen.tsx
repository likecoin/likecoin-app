import * as React from "react"
import { observer } from "mobx-react"
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  Share,
  StatusBar,
  StyleSheet,
} from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
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
import { translate } from "../../i18n"

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
  border-top-width: ${StyleSheet.hairlineWidth}px;
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
export interface ContentViewScreenProps extends NavigationStackScreenProps<ContentViewNavigationStateParams> {}

function delayed(callback: () => void, delay: number) {
  let nextTime = 0
  return () => {
    const now = Date.now()
    if (!nextTime) nextTime = now;
    const diff = Math.min(delay, Math.max(now - nextTime, 0))
    setTimeout(callback, diff)
    nextTime += delay - diff
  }
}

const MATTERS_LIKECOIN_BUTTON_SELECTOR = `document.querySelector('.appreciate-button')`

const getMattersSetLikeCoinButtonEnableScript = (isEnabled = true) => {
  return `
    if (${MATTERS_LIKECOIN_BUTTON_SELECTOR}) {
      ${MATTERS_LIKECOIN_BUTTON_SELECTOR}.style.pointerEvents = '${isEnabled ? "all" : "none"}';
    }
  `;
}

const injectedJavaScript = `${
  /* Forward any post messages to WebView */ ""
  }window.addEventListener('message', function(event) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
  });

  function notifyAppForCustomSite(meta) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      action: 'DETECTED_CUSTOM_SITE',
      value: {
        site: meta.site || '',
        isReady: !!meta.isReady,
        isLoggedIn: !!meta.isLoggedIn,
      },
    }));
  }

  window.onload = function() {
    let host = window.location.host;
    switch (host) {
      case 'matters.news': {
        const site = 'matters';
        notifyAppForCustomSite({ site: site });
        function checkMattersFinishLoading() {
          if (!${MATTERS_LIKECOIN_BUTTON_SELECTOR}) {
            setTimeout(checkMattersFinishLoading, 500);
            return;
          }
          ${getMattersSetLikeCoinButtonEnableScript(false) /* Disabled LikeCoin button on first load */}
          notifyAppForCustomSite({
            site: site,
            isReady: true,
            isLoggedIn: !!document.querySelector('.me-avatar'),
          });
        }
        checkMattersFinishLoading();
        break;
      }
      default:
        break;
    }
  };
  true;${/* NOTE: This is required, or you'll sometimes get silent failures */ ""}`


const CUSTOM_SITES = new Set([
  "matters",
])

@observer
export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
  webViewRef = React.createRef<WebViewBase>()

  state = {
    customSite: "",
    isCustomSiteReady: false,
    isCustomSiteLoggedIn: false,
  }

  componentDidMount() {
    this.content?.read()
    if (this.content?.checkShouldFetchDetails()) {
      this.content?.fetchDetails()
    }
    this.content?.fetchCurrentUserLikeStat()
    this.content?.fetchCurrentUserSuperLikeStat()
  }

  get content() {
    const { content, superLike } = this.props.navigation.state.params
    return superLike ? superLike.content : content
  }

  get url() {
    const { content, superLike } = this.props.navigation.state.params
    return superLike ? superLike.redirectURL : content.url
  }

  get isCustomSite() {
    return CUSTOM_SITES.has(this.state.customSite)
  }

  get shouldAlertCustomSiteLogin() {
    return this.isCustomSite && this.state.isCustomSiteReady && !this.state.isCustomSiteLoggedIn
  }

  get shouldDisableLikeCoinButton() {
    return this.shouldAlertCustomSiteLogin || (this.isCustomSite && !this.state.isCustomSiteReady)
  }

  private pressLikeButtonOnCustomSite = delayed(() => {
    let script = ""
    switch (this.state.customSite) {
      case "matters":
        const elem = "document.querySelector('.appreciate-button button')"
        script = `
          ${getMattersSetLikeCoinButtonEnableScript(true)}
          if (${elem}) ${elem}.click();
          ${getMattersSetLikeCoinButtonEnableScript(false)}
        `
        break;
    
      default:
        break;
    }
    this.webViewRef?.current?.injectJavaScript(script)
  }, 200)

  private pressSuperLikeButtonOnCustomSite = delayed(() => {
    let script = ""
    switch (this.state.customSite) {
      case "matters":
        const elem = "document.querySelector('.appreciate-button.isSuperLike button')"
        script = `
          ${getMattersSetLikeCoinButtonEnableScript(true)}
          if (${elem}) ${elem}.click();
          ${getMattersSetLikeCoinButtonEnableScript(false)}
        `
        break;
    
      default:
        break;
    }
    this.webViewRef?.current?.injectJavaScript(script)
  }, 200)

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private alertCustomSiteLogin = () => {
    Alert.alert(
      translate("content_view_screen_custom_site_login_alert"),
      null,
      [
        { text: translate("common.confirm") }
      ]
    )
  }

  private onPressLike = () => {
    if (!this.isCustomSite || !this.state.isCustomSiteReady) return
    if (this.shouldAlertCustomSiteLogin) {
      this.alertCustomSiteLogin()
      return
    }
    this.pressLikeButtonOnCustomSite()
  }

  private onPressSuperLike = () => {
    if (!this.isCustomSite || !this.state.isCustomSiteReady) return
    if (this.shouldAlertCustomSiteLogin) {
      this.alertCustomSiteLogin()
      return
    }
    this.pressSuperLikeButtonOnCustomSite()
    this.content?.fetchCurrentUserSuperLikeStat()
  }

  private onPressLikeDebounced = (hits: number) => {
    if (this.isCustomSite) return
    this.content?.like(hits)
  }

  private onPressSuperLikeDebounced = () => {
    if (this.isCustomSite) return
    this.content?.superLike()
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
      const { action, value } = JSON.parse(event.nativeEvent?.data)
      switch (action) {
        case "DETECTED_CUSTOM_SITE":
          const { site = "", isReady = false, isLoggedIn = false } = value || {}
          this.setState({
            customSite: site,
            isCustomSiteReady: isReady,
            isCustomSiteLoggedIn: isLoggedIn,
          })
          break

        case "MOUNTED":
          const iframeBaseURL = this.content.getConfig('LIKECOIN_BUTTON_BASE_URL')
          this.webViewRef?.current?.injectJavaScript(`
            let iframes = document.querySelectorAll("iframe");
            for (let i = 0; i < iframes.length; i += 1) {
              let iframe = iframes[i];
              let src = iframe.getAttribute("src")
              if (!src || src.indexOf("${iframeBaseURL}") === -1) continue;
              iframe.contentWindow.postMessage({ action: "DISABLE_BUTTON" }, "${iframeBaseURL}");
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
              leftIcon="back"
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
              isDisabled={this.shouldDisableLikeCoinButton}
              onPressLike={this.onPressLike}
              onPressLikeDebounced={this.onPressLikeDebounced}
              onPressSuperLike={this.onPressSuperLike}
              onPressSuperLikeDebounced={this.onPressSuperLikeDebounced}
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

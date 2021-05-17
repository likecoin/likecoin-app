import * as React from "react"
import { observer } from "mobx-react"
import { Platform, Share } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView as WebViewBase } from "react-native-webview"
import styled from "styled-components/native"

import { Header } from "../../components/header"
import { Screen as ScreenBase } from "../../components/screen"
import { LikeCoinButton as LikeCoinButtonBase } from "../../components/likecoin-button"

import { Content } from "../../models/content"
import { SuperLike } from "../../models/super-like"

import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const WebView = styled(WebViewBase)`
  flex: 1;
`

const LikeCoinButton = styled(LikeCoinButtonBase)`
  position: absolute;
  left: 14px;
  bottom: 14px;
`

export interface ContentViewNavigationStateParams {
  content?: Content
  superLike?: SuperLike
}
export interface ContentViewScreenProps extends NavigationScreenProps<ContentViewNavigationStateParams> {}

@observer
export class ContentViewScreen extends React.Component<ContentViewScreenProps, {}> {
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

  private onPressLike = (count: number) => {
    this.content.like(count)
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

  render() {
    const { content, url } = this
    return (
      <Screen preset="fixed">
        <Header
          headerText={content.normalizedTitle}
          leftIcon="close"
          rightIcon="share"
          onLeftPress={this.goBack}
          onRightPress={this.onShare}
        />
        <WebView
          sharedCookiesEnabled={true}
          source={{ uri: url }}
          decelerationRate={0.998}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
        <LikeCoinButton
          size={64}
          likeCount={content.currentUserLikeCount}
          isSuperLikeEnabled={content.isCurrentUserSuperLiker}
          canSuperLike={content.canCurrentUserSuperLike}
          hasSuperLiked={content.hasCurrentUserSuperLiked}
          cooldownValue={content.currentUserSuperLikeCooldown}
          cooldownEndTime={content.currentUserSuperLikeCooldownEndTime}
          onPressLike={this.onPressLike}
          onPressSuperLike={this.onPressSuperLike}
        />
      </Screen>
    )
  }
}

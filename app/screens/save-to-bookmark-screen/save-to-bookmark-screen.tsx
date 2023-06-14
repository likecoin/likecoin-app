import * as React from "react"
import { Platform, View } from "react-native"
import ShareExtension from "react-native-share-extension"
import CookieManager from "@react-native-cookies/cookies"
import EncryptedStorage from "react-native-encrypted-storage";
import styled from "styled-components/native"

import { SaveToBookmarkScreenStyle as Style } from "./save-to-bookmark-screen.style"
import { logAnalyticsEvent } from "../../utils/analytics"

import { Button } from "../../components/button"
import { Text } from "../../components/text"

import { LikeCoinAPI } from "../../services/api"
import { color } from "../../theme"
import { Icon } from "../../components/icon"
import { Screen } from "../../components/screen"
import { LoadingScreen } from "../../components/loading-screen"

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const ButtonWrapper = styled(View)`
  padding: 14px;
`

export class SaveToBookmarkScreen extends React.Component {
  likecoinAPI = new LikeCoinAPI()

  state = {
    url: "",
    error: undefined,
    isLoading: true,
  }

  async componentDidMount() {
    // FIXME: Hard-coded endpoint
    this.likecoinAPI.setup("https://api.like.co")

    if (Platform.OS === "ios") {
      // Retrieve cookie from main app
      try {
        const session = await EncryptedStorage.getItem("likecoin_auth")
        if (session !== undefined) {
          const cookie = JSON.parse(session)
          await CookieManager.set(this.likecoinAPI.apisauce.getBaseURL(), cookie)
        }
      } catch (error) {
        // No-op
      }
    }

    try {
      const { value }: { value: string } = await ShareExtension.data()
      const results = value.match(URL_REGEX)
      if (!results) {
        this.setState({ error: "invalid-url" })
        return
      }
      const url = results[0]
      this.setState({ url })
      logAnalyticsEvent("ShareExtensionAddBookmark", { url })
      const response = await this.likecoinAPI.users.bookmarks.add(url)
      switch (response.kind) {
        case "ok":
          break

        default:
          this.setState({ error: response.kind })
      }
    } catch (error) {
      console.log(error)
      this.setState({ error: "unknown" })
    } finally {
      this.setState({ isLoading: false })
    }

    if (Platform.OS === "ios") {
      // Clear cookie
      try {
        await CookieManager.clearAll()
      } catch (error) {
        // No-op
      }
    }
  }

  onClose = () => ShareExtension.close()

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingScreen style={Style.Root} />
      )
    }

    return (
      <Screen
        preset="fixed"
        style={Style.Root}
      >
        <View style={Style.HandleWrapper}>
          <View style={Style.Handle} />
        </View>
        <View style={Style.Inner}>
          <Icon
            name="bookmark-outlined"
            fill={color.palette.lightCyan}
            width={64}
            height={64}
          />
          {this.state.error ? (
            <Text
              tx={`SaveToBookmarkScreen.Error.${this.state.error}`}
              size="medium"
              weight="600"
              color="angry"
            />
          ) : (
            <Text
              text="Saved to Liker Land!"
              size="medium"
              weight="600"
              color="likeCyan"
            />
          )}
          <Text
            text={this.state.url}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={Style.LabelURL}
          />
        </View>
        <ButtonWrapper>
          <Button
            preset="outlined"
            tx="SaveToBookmarkScreen.DismissButtonText"
            onPress={this.onClose}
          />
        </ButtonWrapper>
      </Screen>
    )
  }
}

import { observer, inject } from "mobx-react"
import * as React from "react"
import { NavigationScreenProps, SafeAreaView } from "react-navigation"
import {
  Clipboard,
  Share,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { RootStore } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface ReferralScreenProps extends NavigationScreenProps {
  userStore: UserStore,
}
const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.primary,
}
const SCREEN: ViewStyle = {
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
}
const HEADER_BAR: ViewStyle = {
  alignItems: "flex-end",
  width: "100%",
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[1],
}
const INNER: ViewStyle = {
  alignItems: "stretch",
  padding: spacing[4],
}
const SHEET: ViewStyle = {
  alignItems: "center",
  maxWidth: 208,
  marginVertical: spacing[5],
  padding: spacing[5],
  paddingBottom: spacing[0],
  backgroundColor: color.palette.white,
}
const COPY_BUTTON: TextStyle = {
  marginTop: spacing[3],
  textAlign: "center",
}
const ADDRESS: TextStyle = {
  marginTop: spacing[4],
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
  width: "100%",
  padding: spacing[3],
  backgroundColor: color.palette.white,
}

@inject((rootStore: RootStore) => ({
  userStore: rootStore.userStore,
  appReferralLink: rootStore.userStore.userAppReferralLink,
}))
@observer
export class ReferralScreen extends React.Component<ReferralScreenProps, {}> {
  state = {
    isCopied: false
  }

  componentDidMount() {
    if (!this.props.userStore.userAppReferralLink) {
      this.props.userStore.generateUserAppReferralLink()
    }
  }

  private onPressShareButton = () => {
    const url = this.props.userStore.userAppReferralLink
    logAnalyticsEvent('share', { contentType: 'app_referral', itemId: url })
    Share.share({ url, message: url })
  }

  private onPressCopyButton = () => {
    const url = this.props.userStore.userAppReferralLink
    Clipboard.setString(url)
    logAnalyticsEvent('share', { contentType: 'app_referral_copy', itemId: url })
    this.setState({ isCopied: true })
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  render () {
    const appReferralLink = this.props.userStore.userAppReferralLink

    const copyButtonTx = this.state.isCopied ? "common.copied" : "common.copy"

    return (
      <View style={ROOT}>
        <SafeAreaView style={HEADER_BAR}>
          <Button
            preset="icon"
            icon="share"
            onPress={this.onPressShareButton}
          />
        </SafeAreaView>
        <Screen
          preset="fixed"
          backgroundColor={color.transparent}
          style={SCREEN}
        >
          <View style={INNER}>
            <Text
              color="likeCyan"
              size="medium"
              align="center"
              weight="bold"
              tx="receiveScreen.shareYourAddress"
            />
            <Sheet style={SHEET}>
              <Text style={ADDRESS} text={appReferralLink} />
              <Button
                textStyle={COPY_BUTTON}
                preset="link"
                tx={copyButtonTx}
                onPress={this.onPressCopyButton}
              />
            </Sheet>
          </View>
        </Screen>
        <SafeAreaView
          forceInset={{ top: "never", bottom: "always" }}
          style={BOTTOM_BAR}
        >
          <Button
            preset="icon"
            icon="close"
            color="likeGreen"
            onPress={this.onPressCloseButton}
          />
        </SafeAreaView>
      </View>
    )
  }
}

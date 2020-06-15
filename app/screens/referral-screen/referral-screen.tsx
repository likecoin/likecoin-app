import * as React from "react"
import {
  Clipboard,
  Image,
  Share,
  TouchableOpacity,
  View,
} from "react-native"
import {
  NavigationScreenProps,
  ScrollView,
} from "react-navigation"
import { observer, inject } from "mobx-react"

import {
  ReferralScreenStyle as Style,
} from "./referral-screen.style"

import { UserStore } from "../../models/user-store"

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"

import { logAnalyticsEvent } from "../../utils/analytics"

const Graph = require("./graph.png")

export interface ReferralScreenProps extends NavigationScreenProps {
  userStore: UserStore
}

@inject((allStores: any) => ({
  userStore: allStores.userStore as UserStore,
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
      <Screen
        preset="fixed"
        style={Style.Root}
      >
        <Header
          headerTx="ReferralScreen.HeaderTitle"
          leftIcon="back"
          rightIcon="share"
          onLeftPress={this.onPressCloseButton}
          onRightPress={this.onPressShareButton}
        />
        <ScrollView style={Style.ScrollView}>
          <Sheet
            preset="flat"
            isZeroPaddingBottom
            style={Style.Sheet}
          >
            <View style={Style.SheetContent}>
              <Text
                tx="ReferralScreen.Title"
                style={Style.Title}
              />
              <Text
                tx="ReferralScreen.DescriptionLabel"
                style={Style.DescriptionLabel}
              />
              <TouchableOpacity
                style={Style.LinkWrapper}
                onPress={this.onPressCopyButton}
              >
                <Text text={appReferralLink} />
              </TouchableOpacity>
              <Button
                preset="link-dark"
                tx={copyButtonTx}
                style={Style.CopyButton}
                onPress={this.onPressCopyButton}
              />
            </View>
            <Image
              source={Graph}
              style={Style.Graph}
            />
          </Sheet>
        </ScrollView>
      </Screen>
    )
  }
}

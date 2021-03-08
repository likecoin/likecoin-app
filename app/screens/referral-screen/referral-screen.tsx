import * as React from "react"
import {
  Clipboard,
  Linking,
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

import ReferralBanner from "./referral-banner"

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
    const action = this.props.navigation.getParam("action")
    if (action === "copy") {
      this.onPressCopyButton()
    }
  }

  private onPressShareButton = () => {
    const url = this.props.userStore.sponsorLink
    logAnalyticsEvent('share', { contentType: 'app_referral', itemId: url })
    Share.share({ url, message: url })
  }

  private onPressCopyButton = () => {
    const url = this.props.userStore.sponsorLink
    Clipboard.setString(url)
    logAnalyticsEvent('share', { contentType: 'app_referral_copy', itemId: url })
    this.setState({ isCopied: true })
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressLearnMore = () => {
    Linking.openURL(`${this.props.userStore.getConfig("LIKERLAND_URL")}/creators`)
  }

  render () {
    const { sponsorLink } = this.props.userStore

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
              <ReferralBanner style={Style.Graph} />
              <TouchableOpacity
                style={Style.LinkWrapper}
                onPress={this.onPressCopyButton}
              >
                <Text text={sponsorLink} />
              </TouchableOpacity>
              <View style={Style.CopyButtonWrapper}>
                <Button
                  preset="primary"
                  size="small"
                  tx={copyButtonTx}
                  style={Style.CopyButton}
                  onPress={this.onPressCopyButton}
                />
              </View>
            </View>
          </Sheet>

          <Button
            preset="link-dark"
            tx="common.learnMore"
            onPress={this.onPressLearnMore}
          />
        </ScrollView>
      </Screen>
    )
  }
}

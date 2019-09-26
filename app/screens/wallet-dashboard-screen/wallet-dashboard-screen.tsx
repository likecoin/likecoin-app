import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { ViewStyle, View, Image, TextStyle, ImageStyle } from "react-native"
import { observer, inject } from "mobx-react"

import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { UserStore } from "../../models/user-store"
import { ButtonGroup } from "../../components/button-group"

export interface WalletDashboardScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.primary,
}
const DASHBOARD_HEADER: ViewStyle = {
  padding: 24,
  paddingBottom: 64,
}
const USER_INFO_ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const USER_INFO_AVATAR: ImageStyle = {
  width: 64,
  height: 64,
  borderRadius: 32,
}
const USER_INFO_IDENTITY: ViewStyle = {
  marginLeft: 12,
}
const USER_INFO_USER_ID: TextStyle = {
  color: color.palette.white,
  opacity: 0.6,
  fontSize: 12,
}
const USER_INFO_DISPLAY_NAME: TextStyle = {
  color: color.palette.white,
  fontSize: 28,
  fontWeight: "500",
}
const DASHBOARD_HEADER_BUTTON_GROUP_WRAPPER: ViewStyle = {
  alignItems: "center",
  marginTop: 16,
}

@inject("userStore")
@observer
export class WalletDashboardScreen extends React.Component<WalletDashboardScreenProps, {}> {
  _onPressSendButton = () => {
    // TODO: Navigation to send screen
  }
  
  _onPressReceiveButton = () => {
    this.props.navigation.navigate("Receive")
  }

  render () {
    const { currentUser } = this.props.userStore
    return (
      <View style={FULL}>
        <Screen
          backgroundColor={color.transparent}
          preset="scroll"
        >
          <View style={DASHBOARD_HEADER}>
            {currentUser &&
              <View style={USER_INFO_ROOT}>
                <Image
                  style={USER_INFO_AVATAR}
                  source={{ uri: currentUser.avatarURL }}
                />
                <View style={USER_INFO_IDENTITY}>
                  <Text
                    style={USER_INFO_USER_ID}
                    text={`ID: ${currentUser.likerID}`}
                  />
                  <Text
                    style={USER_INFO_DISPLAY_NAME}
                    text={currentUser.displayName}
                  />
                </View>
              </View>
            }
            <View style={DASHBOARD_HEADER_BUTTON_GROUP_WRAPPER}>
              <ButtonGroup
                buttons={[
                  {
                    key: "send",
                    tx: "walletDashboardScreen.send",
                    onPress: this._onPressSendButton,
                  },
                  {
                    key: "receive",
                    tx: "walletDashboardScreen.receive",
                    onPress: this._onPressReceiveButton,
                  },
                ]}
              />
            </View>
          </View>
        </Screen>
      </View>
    )
  }
}

import * as React from "react"
import {
  Image,
  ListRenderItem,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
  Alert,
} from "react-native"
import { FlatList } from "react-navigation"

import {
  WEBSITE_SIGNIN_ITEMS,
  WebsiteSignInItem,
  WebsiteSignInScreenProps as Props,
} from "./website-signin-screen.props"
import {
  WebsiteSignInScreenStyle as Style,
} from "./website-signin-screen.style"

import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { Text } from "../../components/text"
import { Sheet } from "../../components/sheet"
import { Header } from "../../components/header"
import { translate } from "../../i18n"

export class WebsiteSignInScreen extends React.Component<Props> {
  state = {
    url: "",
  }

  private signIn = (inputURL?: string) => {
    const url = inputURL || this.state.url
    if (url) {
      Alert.alert(
        translate("WebsiteSignInScreen.Alert.Title"),
        translate("WebsiteSignInScreen.Alert.Message"),
        [
          {
            text: translate("common.ok"),
            onPress: () => {
              this.props.navigation.navigate("WebsiteSignInWebview", { url })
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  private onURLInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({
      url: event.nativeEvent.text,
    })
  }

  private onPressNextButton = () => {
    this.signIn()
  }

  private onPressHeaderLeftButton = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Screen
        preset="fixed"
        style={Style.Root}
      >
        <Header
          headerTx="WebsiteSignInScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressHeaderLeftButton}
        />
        <FlatList<WebsiteSignInItem>
          data={WEBSITE_SIGNIN_ITEMS}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderListSeparator}
          ListFooterComponent={(
            <Sheet style={Style.ListFooter}>
              <Text
                tx="WebsiteSignInScreen.OtherLabel"
                style={Style.ListItemTitle}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                placeholder="https://example.com"
                selectionColor={color.palette.likeCyan}
                value={this.state.url}
                onChange={this.onURLInputChange}
                onSubmitEditing={this.onPressNextButton}
                style={Style.TextInput}
              />
            </Sheet>
          )}
          style={Style.List}
        />
      </Screen>
    )
  }

  private renderItem: ListRenderItem<WebsiteSignInItem> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.signIn(item.url) }>
        <Sheet style={Style.ListItem}>
          <View style={Style.ListItemLayout}>
            <Image
              source={item.logo}
              style={Style.ListItemImage}
            />
            <Text
              tx={`WebsiteSignInScreen.Item.${item.id}`}
              style={Style.ListItemTitle}
            />
          </View>
        </Sheet>
      </TouchableOpacity>
    )
  }

  private renderListSeparator = () => {
    return (
      <View style={Style.ListSeparator} />
    )
  }
}

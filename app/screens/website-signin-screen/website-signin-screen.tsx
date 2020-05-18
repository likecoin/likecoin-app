import * as React from "react"
import {
  ListRenderItem,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native"
import { FlatList } from "react-navigation"

import {
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

const SIGNIN_ITEMS: WebsiteSignInItem[] = [
  {
    id: "Matters",
    url: "https://matters.news/",
  },
  {
    id: "Appledailytw",
    url: "https://tw.appledaily.com/",
  },
  {
    id: "Appledailyhk",
    url: "https://hk.appledaily.com/",
  },
  {
    id: "Substack",
    url: "https://substack.com/",
  },
  {
    id: "Daodu",
    url: "https://daodu.tech/",
  },
  {
    id: "Nytimes",
    url: "https://www.nytimes.com/",
  },
]

export class WebsiteSignInScreen extends React.Component<Props> {
  state = {
    url: "",
  }

  private signIn = (inputURL?: string) => {
    const url = inputURL || this.state.url
    if (url) {
      this.props.navigation.navigate("WebsiteSignInWebview", { url })
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
          data={SIGNIN_ITEMS}
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
          <Text
            tx={`WebsiteSignInScreen.Item.${item.id}`}
            style={Style.ListItemTitle}
          />
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

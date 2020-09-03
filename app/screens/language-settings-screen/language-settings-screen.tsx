import * as React from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import { inject, observer } from "mobx-react"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { LanguageSettingsScreenStyle as Style } from "./language-settings-screen.style"
import { LanguageSettingsScreenProps as Props } from "./language-settings-screen.props"

@inject("languageSettingsStore")
@observer
export class LanguageSettingsScreen extends React.Component<Props, {}> {
  private keyExtractor = ({ key }) => key

  private onPressHeaderLeftIconButton = () => {
    this.props.navigation.goBack()
  }

  private renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.languageSettingsStore.setLanguage(item.key)
        }}
      >
        <View style={Style.ListItem}>
          <Text
            text={item.name}
            size="medium"
            weight={item.isActive ? "600" : "400"}
            color={item.isActive ? "likeGreen" : "grey4a"}
          />
          {!item.isActive && (
            <Text tx={`Language.${item.key}`} color="grey9b" size="small" />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  private renderSeparator = () => <View style={Style.Separator} />

  render() {
    return (
      <Screen preset="fixed" style={Style.Screen}>
        <Header
          headerTx="LanguageSettingsScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressHeaderLeftIconButton}
        />
        <FlatList
          data={this.props.languageSettingsStore.items}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          style={Style.List}
        />
      </Screen>
    )
  }
}

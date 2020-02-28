import * as React from "react"
import { View } from "react-native"
import ShareExtension from "react-native-share-extension"

import { ShareDialogStyle as Style } from "./share-dialog.style"

import { Button } from "../../components/button"
import { Text } from "../../components/text"

import { LikerLandAPI } from "../../services/api"
import { color } from "../../theme"
import { Icon } from "../../components/icon"

export class ShareDialog extends React.Component {
  likerLandAPI = new LikerLandAPI()

  state = {
    url: "",
    error: false,
  }

  async componentDidMount() {
    // FIXME: Hard-coded endpoint
    this.likerLandAPI.setup("https://like.land/api")

    try {
      const { value: url } = await ShareExtension.data()
      this.setState({ url })
      const response = await this.likerLandAPI.addBookmark(url)
      switch (response.kind) {
        case "ok":
          break

        default:
          this.setState({ error: true })
      }
    } catch (error) {
      console.log(error)
      this.setState({ error: true })
    }
  }

  onClose = () => ShareExtension.close()

  render() {
    return (
      <View style={Style.Root}>
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
              text="Unable to bookmark"
              size="medium"
              weight="600"
              color="angry"
            />
          ) : (
            <Text
              text="Bookmarked to Liker Land!"
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
        <Button
          preset="outlined"
          text="Click to close"
          onPress={this.onClose}
        />
      </View>
    )
  }
}

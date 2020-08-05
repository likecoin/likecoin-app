import * as React from "react"
import { observer } from "mobx-react"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { NotificationScreenStyle as Style } from "./notification-screen.style"
import { NotificationScreenProps as Props } from "./notification-screen.props"

@observer
export class NotificationScreen extends React.Component<Props, {}> {
  render() {
    return (
      <Screen preset="fixed" style={Style.Screen}>
        <Header headerTx="NotificationScreen.Title" />
      </Screen>
    )
  }
}

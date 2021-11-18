import * as React from "react"
import { TouchableOpacity, StyleSheet, ListRenderItem } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationStackScreenProps } from "react-navigation-stack"
import styled from "styled-components/native"

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Icon } from "../../components/icon"
import { Screen as ScreenBase } from "../../components/screen"
import { Text } from "../../components/text"

import { WalletConnectStore } from "../../models/wallet-connect-store"
import { WalletConnectClient } from "../../models/wallet-connect-client"

import { color } from "../../theme"

const Screen = styled(ScreenBase)`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const List = styled.FlatList`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`

const ListEmptyView = styled.View`
  min-height: 480px;
  padding-left: ${({ theme }) => theme.spacing["2xl"]};
  padding-right: ${({ theme }) => theme.spacing["2xl"]};
  justify-content: center;
  align-items: center;
`

const NewConnectButton = styled(Button)`
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
`

const ListItem = styled.View`
  align-items: center;
  flex-direction: row;
  min-height: 44px;
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
`

const PeerName = styled(Text)`
  flex-grow: 1;
`

const Separator = styled.View`
  background-color: ${({ theme }) => theme.color.separator};
  height: ${StyleSheet.hairlineWidth};
  margin: 0 ${({ theme }) => theme.spacing.lg};
`

const PeerAvatar = styled.Image`
  border-radius: 8px;
  width: 36px;
  height: 36px;
  margin-right: 8px;
`

export interface WalletConnectListScreenProps extends NavigationStackScreenProps<{}> {
  walletConnectStore: WalletConnectStore
}

@inject("walletConnectStore")
@observer
export class WalletConnectListScreen extends React.Component<WalletConnectListScreenProps, {}> {
  private handlePressBackButton = () => {
    this.props.navigation.goBack()
  }

  private keyExtractor = (item: WalletConnectClient) => item.connector.peerId

  private renderItem: ListRenderItem<WalletConnectClient> = ({ item }) => {
    const { name, icons } = item.connector.peerMeta
    return (
      <ListItem>
        <PeerAvatar
          source={{ uri: icons[0] }}
        />
        <PeerName
          text={name}
          size="medium"
          weight="600"
          color="likeGreen"
        />
        <TouchableOpacity
          onPress={item.disconnect}
        >
          <Icon
            color={color.palette.greyd8}
            name="close"
            width={24}
            height={24}
          />
        </TouchableOpacity>
      </ListItem>
    )
  }

  private renderSeparator = () => <Separator />

  private startScanner = () => {
    this.props.navigation.navigate("QRCodeScan")
  }

  render() {
    return (
      <Screen preset="fixed">
        <Header
          headerText="Wallet Connect"
          leftIcon="back"
          rightIcon="qrcode-scan"
          onLeftPress={this.handlePressBackButton}
          onRightPress={this.startScanner}
        />
        <List
          data={this.props.walletConnectStore.activeClients}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={(
            <ListEmptyView>
              <NewConnectButton
                preset="primary"
                text="New connection"
                onPress={this.startScanner}
              />
            </ListEmptyView>
          )}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </Screen>
    )
  }
}

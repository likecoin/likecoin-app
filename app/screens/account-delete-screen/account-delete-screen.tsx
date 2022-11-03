import * as React from "react"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { I18n } from "../../components/i18n"
import { Text } from "../../components/text"
import { Screen as ScreenBase } from "../../components/screen"

import { UserStore } from "../../models/user-store"
import { ChainStore } from "../../models/chain-store"

import { color } from "../../theme"

import { logError } from "../../utils/error"

const Screen = styled(ScreenBase)`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const NoticeView = styled.View`
  margin-top:  ${({ theme }) => theme.spacing.xl};
  margin-bottom:  ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  border-width: 1px;
  border-radius: 14px;
  border-color: ${({ theme }) => theme.color.palette.angry};
`

const MessageLabel = styled(I18n)`
  margin-top:  ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.text.size.md};
  text-align: center;
`

const NoticeText = styled(Text)`
  margin-top:  ${({ theme }) => theme.spacing.sm};
`

const InputLabel = styled(I18n)`
  text-align: center;
`

const InputField = styled.TextInput`
  margin-top:  ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.color.palette.black};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.palette.white};
  text-align: center;
`

const ConfirmButton = styled(Button)`
  margin-top:  ${({ theme }) => theme.spacing.md};
`

export interface AccountDeleteScreenProps extends NavigationStackScreenProps<{}> {
  chainStore: ChainStore
  userStore: UserStore
}

const CONFIRM_MESSAGE = 'DELETE';

const ACCOUNT_DELETE_MESSAGE = 'Confirm Delete Liker ID';

@inject("chainStore", "userStore")
@observer
export class AccountDeleteScreen extends React.Component<AccountDeleteScreenProps, {}> {
  state = {
    confirmMessage: '',
    isLoading: false,
  }

  get isConfirmButtonEnabled() {
    return this.state.confirmMessage === CONFIRM_MESSAGE;
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = async () => {
    try {
      this.setState({ isLoading: true })

      const { likeWallet } = this.props.userStore.currentUser
      let memo = JSON.stringify({
        action: 'user_delete',
        likeWallet,
        ts: Date.now(),
      })
      memo = [`${ACCOUNT_DELETE_MESSAGE}:`, memo].join(' ')
      const signature: any = await this.props.chainStore.signMemo(memo, likeWallet)

      await this.props.userStore.deleteAccount(likeWallet, signature)
    } catch (error) {
      logError(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header
          headerTx="account_delete_screen_title"
          leftIcon="back"
          onLeftPress={this.goBack}
        />
        <ScrollView>
          <MessageLabel tx="account_delete_screen_message">
            <Text
              text={this.props.userStore.currentUser?.likerID || ""}
              place="id"
              color="likeGreen"
              weight="600"
            />
          </MessageLabel>
          <NoticeView>
            <Text tx="account_delete_screen_notice_1" />
            <NoticeText tx="account_delete_screen_notice_2" />
          </NoticeView>
          <InputLabel tx="account_delete_screen_input_label">
            <Text
              text={CONFIRM_MESSAGE}
              place="code"
              color="angry"
              weight="600"
            />
          </InputLabel>
          <InputField
            value={this.state.confirmMessage}
            selectionColor={color.palette.angry}
            placeholder={CONFIRM_MESSAGE}
            placeholderTextColor={color.palette.lighterGrey}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            underlineColorAndroid={color.transparent}
            onChangeText={value => this.setState({ confirmMessage: value.toUpperCase() })}
          />
          <ConfirmButton
            tx="account_delete_screen_confirm"
            preset="danger"
            disabled={!this.isConfirmButtonEnabled || this.state.isLoading}
            isLoading={this.state.isLoading}
            onPress={this.onPressConfirmButton}
          />
        </ScrollView>
      </Screen>
    )
  }
}

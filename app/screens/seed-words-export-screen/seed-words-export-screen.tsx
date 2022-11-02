import * as React from "react"
import { Clipboard } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"
import { AuthCoreAuthClient } from "@likecoin/authcore-js"

import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"
import { Screen as ScreenBase } from "../../components/screen"

import { translate } from "../../i18n"

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
`

const NoticeView = styled.View`
  margin-bottom:  ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.color.palette.white};
  border-radius: 14px;
`

const NoticeTitle = styled(Text)`
  color: ${({ theme }) => theme.color.palette.angry};
  text-align: center;
  font-size: ${({ theme }) => theme.text.size.xl};
  font-weight: 600;
`

const NoticeDescription = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.text.size.md};
  color: ${({ theme }) => theme.color.palette.angry};
`

const PasswordInputLabel = styled(Text)`
  color: ${({ theme }) => theme.color.palette.white};
`

const PasswordInputField = styled.TextInput`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.palette.white};
  color: ${({ theme }) => theme.color.palette.black};
  text-align: center;
`

const AuthenticateButton = styled(Button)`
  margin-top:  ${({ theme }) => theme.spacing.md};
`

const SeedWordsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.palette.white};
  border-radius: 14px;
`

const SeedWordText = styled.Text`
  padding: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.palette.greyf2};
  margin: 4px;
`

const CopySeedWordsButton = styled(Button)`
  margin-top:  ${({ theme }) => theme.spacing.md};
`

const ErrorView = styled.View`
  flex-direction: row;
  margin-top:  ${({ theme }) => theme.spacing.md};
`

export interface SeedWordsExportScreenProps extends NavigationStackScreenProps<{}> {
  chainStore: ChainStore
  userStore: UserStore
}

@inject("chainStore", "userStore")
@observer
export class SeedWordsExportScreen extends React.Component<SeedWordsExportScreenProps, {}> {
  state = {
    isLoading: false,
    isConfirmed: false,
    isPasswordNeeded: false,
    isCopied: false,
    password: '',
    seeds: '',
    error: '',
  }

  authClient: AuthCoreAuthClient

  get seedWords() {
    return this.state.seeds.split(' ')
  }

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private exportSeedWords = async () => {
    try {
      const token = await this.props.userStore.env.authCoreAPI.getSeedWordsExportToken(this.authClient, this.state.password)
      const seeds = await this.props.userStore.env.authCoreAPI.exportSeedWords(token)
      this.setState({ seeds })
    } catch (error) {
      let errorMessage = ''
      const rawErrorMessage = error.response?.body?.error || error.message || error
      if (rawErrorMessage.includes("invalid password")) {
        errorMessage = translate("seed_words_export_screen_error_invalid_password")
      } else {
        logError(error)
        errorMessage = rawErrorMessage
      }
      this.setState({ error: errorMessage })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private onPressConfirmButton = async () => {
    try {
      this.setState({ isLoading: true, error: '' })
      const { accessToken }: any = await this.props.userStore.authCore.reAuth()
      this.authClient = await this.props.userStore.env.authCoreAPI.getAuthClient(accessToken)
      const { isPasswordNeeded } = await this.props.userStore.env.authCoreAPI.checkSeedWordsExportChallenge(this.authClient)
      if (!isPasswordNeeded) {
        await this.exportSeedWords()
      }
      this.setState({ 
        isLoading: false,
        isConfirmed: true,
        isPasswordNeeded,
      })
    } catch (error) {
      logError(error)
      this.setState({
        isLoading: false,
        error: error?.error !== 'authcore.session.user_cancelled' ? `${error?.error || error}` : '',
      })
    }
  }

  private onPressAuthenticateButton = () => {
    this.setState({ isLoading: true, error: '' })
    // XXX: Use setTimeout to mitigate the delay of showing loading progress indicator in button
    setTimeout(this.exportSeedWords, 10)
  }

  private onPressCopySeedWords = () => {
    Clipboard.setString(this.state.seeds)
    this.setState({ isCopied: true })
  }

  private renderErrorView = () => {
    const { error } = this.state
    if (!error) return null
    return (
      <ErrorView>
        <Text
          text={error}
          color="angry"
          isHidden={!error}
          prepend={
            <Icon
              name="alert-circle"
              color="angry"
              width={sizes.medium}
              height={sizes.medium}
            />
          }
        />
      </ErrorView>
      )
  }

  private renderView = () => {
    if (!this.state.isConfirmed) {
      return (
        <Button
          tx="seed_words_export_screen_warning_confirm_button"
          preset="primary"
          isLoading={this.state.isLoading}
          onPress={this.onPressConfirmButton}
        />
      )
    }

    if (!this.state.seeds && this.state.isPasswordNeeded) {
      return (
        <>
          <PasswordInputLabel tx="seed_words_export_screen_password_label" />
          <PasswordInputField
            value={this.state.password}
            selectionColor={color.palette.likeCyan}
            placeholderTextColor={color.palette.lighterGrey}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            underlineColorAndroid={color.transparent}
            secureTextEntry={true}
            editable={!this.state.isLoading}
            autoFocus
            onChangeText={value => this.setState({ password: value })}
            onSubmitEditing={this.onPressAuthenticateButton}
          />
          <AuthenticateButton
            tx="account_delete_screen_confirm"
            preset="primary"
            isLoading={this.state.isLoading}
            onPress={this.onPressAuthenticateButton}
          />
        </>
      )
    }
          
    if (this.state.seeds) {
      return (
        <>
          <SeedWordsContainer>
            {this.seedWords.map((seedWord, i) => <SeedWordText key={i}>{seedWord}</SeedWordText>)}
          </SeedWordsContainer>
          <CopySeedWordsButton
            tx={this.state.isCopied
              ? "seed_words_export_screen_seed_words_copied_button"
              : "seed_words_export_screen_seed_words_copy_button"
            }
            onPress={this.onPressCopySeedWords}
          />
        </>
      )
    }

    return null
  }

  render() {
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header
          headerTx="seed_words_export_screen_title"
          leftIcon="back"
          onLeftPress={this.goBack}
        />
        <ScrollView>
          <NoticeView>
            <NoticeTitle tx="seed_words_export_screen_warning_title" />
            <NoticeDescription tx="seed_words_export_screen_warning_description" />
          </NoticeView>
          {this.renderView()}
          {this.renderErrorView()}
        </ScrollView>
      </Screen>
    )
  }
}

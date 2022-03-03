import * as React from "react"
import { ViewStyle } from "react-native"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { ChainStore } from "../../models/chain-store"

import { ButtonGroup } from "../../components/button-group"
import { GradientView } from "../../components/gradient-view"
import { Icon } from "../../components/icon"
import {
  TableViewCell as TableViewCellBase,
  TableViewCellProps,
} from "../../components/table-view"
import { Text } from "../../components/text"

import { spacing } from "../../theme"

const TableViewCell = styled(TableViewCellBase)`
  min-height: 85px;
`

const ContentView = styled.View`
  flex-grow: 1;
`

const WalletAppUpgradeNotice = styled(Text)`
  width: 100%;
  margin: ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.color.text.highlight};
  font-weight: 600;
  font-size: 14px;
  text-align: center;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`

const TitleText = styled(Text)`
  margin: 0 ${props => props.theme.spacing.xs};
  color: ${props => props.theme.color.text.highlight};
  font-size: ${props => props.theme.text.size.sm};
  font-weight: 600;
`

const BalanceContainer = styled.View`
  margin-top: ${props => props.theme.spacing.sm};
  flex-direction: row;
  align-items: center;
`

const BalanceText = styled(Text)`
  color: ${props => props.theme.color.text.highlight};
  font-size: ${props => props.theme.text.size.xl};
  font-weight: 600;
`

const BalanceActivityIndicator = styled.ActivityIndicator`
  margin-left: ${props => props.theme.spacing.sm};
`

const QRCodeButtonWrapper = styled(ButtonGroup)`
  margin-right: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.color.text.secondary + "33"};
`

const QRCodeButtonStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  width: 44,
} as ViewStyle

export interface DashboardWalletPanelProps extends TableViewCellProps {
  chainStore?: ChainStore
  style?: ViewStyle
  onPress?: () => void
  onPressQRCodeButton?: () => void
}

@inject("chainStore")
@observer
export class DashboardWalletPanel extends React.Component<
  DashboardWalletPanelProps
> {
  componentDidMount() {
    if (this.props.chainStore.env.appConfig.getIsDeprecatedAppVersionForWalletFeature()) return
    this.props.chainStore.fetchAll()
  }

  renderUpdateNotice() {
    return (
      <TableViewCell isNoPadding>
        <GradientView>
          <TableViewCell isNoBackground>
            <WalletAppUpgradeNotice
              tx="dashboard_app_update_notice_for_wallet"
            />
          </TableViewCell>
        </GradientView>
      </TableViewCell>
    )
  }

  renderActiveWallet() {
    return (
      <TableViewCell
        isNoPadding
        isChildrenRaw={true}
        onPress={this.props.onPress}
      >
        <GradientView>
          <TableViewCell isNoBackground>
            <ContentView>
              <Header>
                <Icon
                  name="tab-wallet"
                  color="likeGreen"
                  width={16}
                  height={16}
                />
                <TitleText tx="settingsScreen.Panel.Wallet.Title" />
                <Icon
                  name="arrow-right"
                  color="likeGreen"
                  width={16}
                  height={16}
                />
              </Header>
              <BalanceContainer>
                <BalanceText
                  text={this.props.chainStore.formattedConciseTotalBalance}
                />
                {!!this.props.chainStore.isLoading && (
                  <BalanceActivityIndicator size="small" />
                )}
              </BalanceContainer>
            </ContentView>
            <QRCodeButtonWrapper
              buttons={[
                {
                  key: "scan",
                  preset: "icon",
                  icon: "qrcode-scan",
                  color: "likeGreen",
                  style: QRCodeButtonStyle,
                  onPress: this.props.onPressQRCodeButton,
                },
              ]}
            />
          </TableViewCell>
        </GradientView>
      </TableViewCell>
    )
  }

  render() {
    if (this.props.chainStore.env.appConfig.getIsDeprecatedAppVersionForWalletFeature()) {
      return this.renderUpdateNotice()
    }
    return this.renderActiveWallet()
  }
}

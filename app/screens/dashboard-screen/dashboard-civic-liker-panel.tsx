import * as React from "react"
import styled from "styled-components/native"

import { Validator } from "../../models/validator"

import { Button } from "../../components/button"
import CivicLikerV3ControlledSummaryView from "../../components/civic-liker-v3/controlled-summary-view"

import CivicLikerLogo from "../../assets/graph/civic-liker-logo.svg"
import { translate } from "../../i18n"
import { Text } from "../../components/text"
import { Icon } from "../../components/icon"

const RootView = styled.View``

const HeaderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`

const HeaderLeftView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md};
`

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.text.size.lg};
  margin-left: ${({ theme }) => theme.spacing.md};
`

export interface DashboardCivicLikerPanelProps {
  onPressStake?: (validator: Validator) => void
}

export class DashboardCivicLikerPanel extends React.Component<
  DashboardCivicLikerPanelProps
> {
  render() {
    return (
      <RootView>
        <HeaderView>
          <HeaderLeftView>
            <CivicLikerLogo />
            <Title
              tx="civic_liker_v3_dashboard_title"
              color="likeGreen"
              weight="600"
            />
          </HeaderLeftView>
          <Button
            preset="link-plain"
            tx="civic_liker_v3_about"
            link={translate("civic_liker_v3_about_url")}
            append={(
              <Icon name="external-link" color="grey9b" width={12} height={12} />
            )}
          />
        </HeaderView>
        <CivicLikerV3ControlledSummaryView
          preset="cta"
          sheetPreset="flat"
          onPressButton={this.props.onPressStake}
        />
      </RootView>
    )
  }
}


import * as React from "react";
import { Linking, Share, View } from "react-native";
import styled, { useTheme } from "styled-components/native";

import { translate } from "../../i18n";
import { logError } from "../../utils/error";

import { Button } from "../button";
import { LaunchIcon } from "../icon/icons/launch";
import { TableView } from "../table-view/table-view";
import { TableViewCell as TableViewCellBase} from "../table-view/table-view-cell";
import { Text } from "../text";

import { SponsorLinkCTAGraph } from "./sponsor-link-cta-graph";

const HeaderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const HeaderButton = styled(Button)`
  padding-right: 0;
`

const HeaderButtonText = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.text.size.sm};
  font-weight: 600;
  border-bottom-color: ${({ theme }) => theme.color.text.secondary};
  border-bottom-width: 1px;
`

const HeaderButtonIcon = styled(LaunchIcon)`
  margin-left: ${({ theme }) => theme.spacing.xs};
  width: 8px;
  height: 8px;
`

const TableViewCell = styled(TableViewCellBase)`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const DescriptionText = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.text.size.sm};
  font-weight: 500;
  margin-left: ${({ theme }) => theme.spacing.xl};
`

const DescriptionGraph = styled(SponsorLinkCTAGraph)`
  flex-shrink: 1;
  width: 44px;
  height: 40px;
`

const ContentView = styled.View`
  flex: 1;
`

const CTAButton = styled(Button)`
  flex-shrink: 1;
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
`

interface SponsorLinkCTATableViewProps {
  likerID: string
}

export function SponsorLinkCTATableView({
  likerID,
  ...props
}: SponsorLinkCTATableViewProps) {
  const handleHeaderButtonPress = () => {
    Linking.openURL("https://liker.land/creators")
  }

  const handleCTAButtonPress = React.useCallback(async () => {
    try {
      const url = `https://liker.land/${likerID}/civic`
      await Share.share({ message: translate("sponsor_link_cta_share_message", { url }) })
    } catch (error) {
      logError(error)
    }
  }, [likerID])

  const theme = useTheme()

  return (
    <View {...props}>
      <HeaderView>
        <Text
          tx="sponsor_link_cta_header_label"
          color="likeGreen"
          weight="600"
        />
        <HeaderButton
          preset="plain"
          size="tiny"
          onPress={handleHeaderButtonPress}
        >
          <HeaderButtonText tx="sponsor_link_cta_header_button" />
          <HeaderButtonIcon color={theme.color.text.secondary} />
        </HeaderButton>
      </HeaderView>
      <TableView>
        <TableViewCell>
          <ContentView>
            <DescriptionContainer>
              <DescriptionGraph />
              <DescriptionText tx="sponsor_link_cta_description" />
            </DescriptionContainer>
            <CTAButton
              tx="sponsor_link_cta_button"
              size="small"
              onPress={handleCTAButtonPress}
            />
          </ContentView>
        </TableViewCell>
      </TableView>
    </View>
  )
}

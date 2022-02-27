import * as React from "react"
import { View, ViewStyle } from "react-native"
import styled, { useTheme } from "styled-components/native"

import { translate } from "../../i18n"

import { Button } from "../button"
import { GradientView } from "../gradient-view"
import { I18n } from "../i18n"
import { Icon } from "../icon"
import { Sheet, SheetPresetType } from "../sheet"
import { Text } from "../text"

const InactiveHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.color.palette.lightGreen};
`

const InactiveStatusLabel = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.text.size.lg};
  font-weight: 600;
`

const ActiveHeader = styled(GradientView)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const ActiveStatusLabel = styled(Text)`
  color: ${({ theme }) => theme.color.palette.likeGreen};
  font-size: ${({ theme }) => theme.text.size.lg};
  font-weight: 600;
`

const HeaderIcon = styled(Icon)`
  margin-left: ${({ theme }) => theme.spacing.sm};
`

const Body = styled.View`
  padding: ${({ theme }) => theme.spacing.xl};
`

const HintLabel = styled(I18n)`
  font-size: ${({ theme }) => theme.text.size.lg};
`

const ProgressBarTrack = styled.View`
  position: relative;
  height: 8px;
  margin-top: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.color.palette.greyd8};
  border-radius: 8px;
`

const ProgressBarFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.palette.likeCyan};
  border-radius: 8px;
`

const ProgressAmountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const ProgressAmountLabel = styled(Text)`
  font-size: ${({ theme }) => theme.text.size.md};
`

const ProgressAmountIcon = styled(Icon)`
  margin-right: ${({ theme }) => theme.spacing.sm};
`

const ButtonContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md};
  align-items: center;
`

const ActionButton = styled(Button)`
  min-width: 120px;
  padding-left: ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.sm};
`

const ButtonIcon = styled(Icon)`
  margin-left: ${({ theme }) => theme.spacing.md};
`

interface CivicLikerV3SummaryViewProps {
  preset?: string
  validatorName?: string
  status?: string
  stakingAmount?: number
  stakingAmountTarget?: number
  prepend?: React.ReactNode
  sheetPreset?: SheetPresetType
  style?: ViewStyle
  onPressButton?: () => void
}

export function CivicLikerV3SummaryView({
  preset = "default",
  validatorName,
  status = "loading",
  stakingAmount = 0,
  stakingAmountTarget = 0,
  prepend,
  sheetPreset = "raised",
  style,
  onPressButton,
}: CivicLikerV3SummaryViewProps) {
  const theme = useTheme()

  const isLoading = status === "loading"
  const isMetStakingTarget = stakingAmount !== 0 && stakingAmount >= stakingAmountTarget

  const statusLabelTx = React.useMemo(() => {
    switch (status) {
      case "loading":
        return "civic_liker_v3_summary_status_loading"
      case "active":
        return "civic_liker_v3_summary_status_active"
      case "activating":
        return "civic_liker_v3_summary_status_activating"
      default:
      case "inactive":
        return "civic_liker_v3_summary_status_inactive"
    }
  }, [status])

  const hintLabelTx = React.useMemo(() => {
    switch (status) {
      case "active":
        if (preset === "undelegate") {
          return "civic_liker_v3_summary_hint_undelegate"
        }
        return "civic_liker_v3_summary_hint_active"
      case "activating":
        return "civic_liker_v3_summary_hint_activating"
      case "inactive":
      default:
        return "civic_liker_v3_summary_hint_inactive"
    }
  }, [status, preset])

  const stakingAmountRequired = Math.ceil(stakingAmountTarget) - Math.floor(stakingAmount)

  const formattedStakingAmount = isLoading ? "-" : Math.floor(stakingAmount).toLocaleString()
  const formattedStakingAmountTarget = isLoading ? "-" : stakingAmountTarget.toLocaleString()
  const formattedStakingAmountRequired = stakingAmountRequired.toLocaleString()

  const hintAmount = React.useMemo(() => {
    if (preset === "undelegate") {
      return formattedStakingAmountTarget
    }
    return isMetStakingTarget
      ? formattedStakingAmount
      : formattedStakingAmountRequired
  }, [
    preset,
    formattedStakingAmount,
    formattedStakingAmountTarget,
    formattedStakingAmountRequired,
  ])
  
  const progressBarWidth = `${Math.min(100, stakingAmount / stakingAmountTarget * 100)}%`

  const buttonTitle = React.useMemo(() => {
    if (status !== "inactive") {
      return "civic_liker_v3_summary_manage_button_active"
    }
    return "civic_liker_v3_summary_manage_button_inactive"
  }, [status])

  const buttonPreset = React.useMemo(() => {
    if (isLoading) return "secondary"
    return isMetStakingTarget ? "secondary-outlined" : "primary"
  }, [isLoading, isMetStakingTarget])

  const children = []

  if (prepend) {
    children.push(
      <View key="prepend">{prepend}</View>
    )
  }

  if (preset !== "mini" && preset !== "undelegate") {
    if (!isMetStakingTarget) {
      children.push(
        <InactiveHeader key="header">
          <InactiveStatusLabel tx={statusLabelTx} />
        </InactiveHeader>
      )
    } else {
      children.push(
        <ActiveHeader key="header">
          <ActiveStatusLabel tx={statusLabelTx} />
          <HeaderIcon
            name="tick"
            color={theme.color.palette.likeGreen}
          />
        </ActiveHeader>
      )
    }
  }

  children.push(
    <Body key="body">
      {isLoading ? (
        <Text text="" />
      ) : (
        <HintLabel tx={hintLabelTx}>
          <Text
            text={validatorName}
            place="validator"
            color="likeGreen"
            weight="600"
          />
          <Text
            text={`${hintAmount} LIKE`}
            place="amount"
            color="likeGreen"
            weight="600"
          />
          <Text
            text={translate("civic_liker_v3_summary_hint_civic_liker")}
            place="civicLiker"
            color="likeGreen"
            weight="600"
          />
        </HintLabel>
      )}
      {preset !== "undelegate" && (
        <ProgressBarTrack>
          <ProgressBarFill style={{ width: progressBarWidth }} />
        </ProgressBarTrack>
      )}
      {preset !== "undelegate" && (
        <ProgressAmountContainer>
          {isMetStakingTarget &&
            <ProgressAmountIcon
              name="tick"
              color={theme.color.palette.green}
              width={16}
            />
          }
          <ProgressAmountLabel>
            <Text
              text={formattedStakingAmount}
              color="likeGreen"
            />
            <Text
              text={` / ${formattedStakingAmountTarget} LIKE`}
              color="grey9b"
            />
          </ProgressAmountLabel>
        </ProgressAmountContainer>
      )}
      {preset === "cta" && (
        <ButtonContainer>
          <ActionButton
            tx={buttonTitle}
            preset={buttonPreset}
            prepend={!isLoading && !isMetStakingTarget && (
              <ButtonIcon
                name="plus"
                color={theme.color.palette.likeGreen}
                width={20}
                height={20}
              />
            )}
            disabled={isLoading}
            isLoading={isLoading}
            onPress={onPressButton}
          />
        </ButtonContainer>
      )}
    </Body>
  )

  return (
    <Sheet
      isZeroPaddingTop
      isZeroPaddingBottom
      preset={sheetPreset}
      style={style}
    >      
      {children}
    </Sheet>
  )
}

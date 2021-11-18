import * as React from "react"
import { ViewStyle } from "react-native"
import styled from "styled-components/native"

import { Button } from "../button"
import { Sheet as SheetBase } from "../sheet"

const RootView = styled.View`
  padding: ${({ theme }) => theme.spacing.xl};
`

const Sheet = styled(SheetBase)`
  padding: ${({ theme }) => theme.spacing.xl};
`

const RequestContentVIew = styled.TextInput`
  font-family: Courier;
  font-size: ${({ theme }) => theme.text.size.xs};
`

const ActionButtonContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const ActionButtonWrapper = styled.View`
  width: 50%;
`

const RejectButtonWrappeer = styled(ActionButtonWrapper)`
  padding-right: ${({ theme }) => theme.spacing.sm};
`

const ApproveButtonWrapper = styled(ActionButtonWrapper)`
  padding-left: ${({ theme }) => theme.spacing.sm};
`

export interface WalletConnectSessionRequestViewProps {
  payload: any

  onApprove: () => void

  onReject: () => void

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * View for display Wallet Connect session request
 */
export function WalletConnectSessionRequestView(props: WalletConnectSessionRequestViewProps) {
  const { style, payload} = props
  return (
    <RootView style={style}>
      <Sheet>
        <RequestContentVIew
          value={JSON.stringify(payload, null, "  ")}
          numberOfLines={10}
          editable={false}
          scrollEnabled={false}
          multiline
        />
      </Sheet>
      <ActionButtonContainer>
        <RejectButtonWrappeer>
          <Button
            preset="outlined"
            text="Reject"
            onPress={props.onReject}
          />
        </RejectButtonWrappeer>
        <ApproveButtonWrapper>
          <Button
            preset="primary"
            text="Approve"
            onPress={props.onApprove}
          />
        </ApproveButtonWrapper>
      </ActionButtonContainer>
    </RootView>
  )
}

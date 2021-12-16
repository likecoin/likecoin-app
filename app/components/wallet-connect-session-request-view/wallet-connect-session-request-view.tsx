import * as React from "react"
import { ViewStyle } from "react-native"
import styled from "styled-components/native"

import { translate } from "../../i18n"

import { Button } from "../button"
import { Sheet as SheetBase } from "../sheet"
import { Text } from "../text"

const RootView = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const Sheet = styled(SheetBase)`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const RequestRawContentView = styled.TextInput`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 14px;
  background-color: ${({ theme }) => theme.color.background.secondary};
  font-family: Courier;
  font-size: ${({ theme }) => theme.text.size.xs};
`

const RequestContentView = styled.View`
  flex: 1;
  justify-content: center;
`

const ImageView = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.color.background.image.placeholder};
`

const TitleText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.color.text.highlight};
  font-size: ${({ theme }) => theme.text.size["2xl"]};
`

const DescriptionText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.text.size.md};
`

const RequestActionsContainer = styled.View`
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

export interface WalletConnectRequestData {
  payload?: any

  peerMeta?: any
}

export interface WalletConnectSessionRequestViewProps extends WalletConnectRequestData {
  onApprove?: () => void

  onReject?: () => void

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

function getAppName({ payload = {}, peerMeta = {} }: WalletConnectRequestData) {
  switch (payload.method) {
    case "session_request":
      return (payload.params[0]?.peerMeta || peerMeta || {}).name
  
    default:
      return peerMeta.name || ""
  }
}

function getImage({ payload = {}, peerMeta = {} }: WalletConnectRequestData) {
  switch (payload.method) {
    case "session_request":
      return (payload.params[0]?.peerMeta || peerMeta || {}).icons[0]
  
    default:
      return (peerMeta.icons || [])[0] || ""
  }
}
function getDescription({
  payload,
  peerMeta,
}: WalletConnectRequestData) {
  const name = getAppName({ payload, peerMeta })
  switch (payload.method) {
    case "session_request":
      return translate("walletConnectRequestView_label_description_sessionRequest", { name })

    case "cosmos_getAccounts":
    case "keplr_get_key_wallet_connect_v1":
      return translate("walletConnectRequestView_label_description_getAccounts", {
        name,
        chainIds: (payload.params || []).join(', ')
      })

    case "cosmos_signAmino":
    case "cosmos_signDirect":
    case "keplr_sign_amino_wallet_connect_v1":
      return translate("walletConnectRequestView_label_description_sign", { name })

    default:
      return ""
  }
}

const SIGN_METHODS = [
  "cosmos_signAmino",
  "keplr_sign_amino_wallet_connect_v1",
  "cosmos_signDirect",
]

/**
 * View for display Wallet Connect session request
 */
export function WalletConnectSessionRequestView(props: WalletConnectSessionRequestViewProps) {
  const {
    payload = {},
    peerMeta = {},
    style,
  } = props
  const {
    title,
    image,
    description,
    rawContent,
  } = React.useMemo(() => {
    const appName = getAppName({ payload, peerMeta })
    const appIcon = getImage({ payload, peerMeta })
    const description = getDescription({ payload, peerMeta })
    const isUnknownMethod = !description
    const isSigningTx = SIGN_METHODS.includes(payload.method)
    let rawContent: any
    if (isUnknownMethod) {
      rawContent = payload
    } else if (isSigningTx) {
      rawContent = payload.params[0]
    }
    return {
      title: appName,
      image: appIcon,
      description: isUnknownMethod
        ? translate("walletConnectRequestView_label_description_unknown", { name: appName })
        : description,
      rawContent: rawContent ? JSON.stringify(rawContent, null, "  ") : "",
    }
  }, [payload, peerMeta])

  return (
    <RootView style={style}>
      <RequestContentView>
        <Sheet>
          {!!image && <ImageView source={{ uri: image }} />}
          <TitleText text={title} />
          <DescriptionText text={description} />
          {!!rawContent && (
            <RequestRawContentView
              value={rawContent}
              numberOfLines={10}
              editable={false}
              scrollEnabled={false}
              multiline
            />
          )}
        </Sheet>
      </RequestContentView>
      <RequestActionsContainer>
        <RejectButtonWrappeer>
          <Button
            preset="outlined"
            tx="walletConnectRequestView_button_reject"
            onPress={props.onReject}
          />
        </RejectButtonWrappeer>
        <ApproveButtonWrapper>
          <Button
            preset="primary"
            tx="walletConnectRequestView_button_approve"
            onPress={props.onApprove}
          />
        </ApproveButtonWrapper>
      </RequestActionsContainer>
    </RootView>
  )
}

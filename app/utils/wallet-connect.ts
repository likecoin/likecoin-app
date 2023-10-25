import { SignClientTypes } from "@walletconnect/types"

import { COMMON_API_CONFIG } from "../services/api/api-config"

export function checkIsInAppBrowser(payload: SignClientTypes.EventArguments['session_proposal']) {
  return COMMON_API_CONFIG.userAgent.includes(
    payload.params.proposer.metadata.name
  )
}

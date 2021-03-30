import * as React from "react"

import { ReferralCTAStyle as Style } from "./referral-cta.style"
import { ReferralCTAProps as Props } from "./referral-cta.props"

import { Sheet } from "../sheet"
import { Button } from "../button"

export function ReferralCTA(props: Props) {
  return (
    <Sheet
      style={Style.Sheet}
      isZeroPaddingBottom={true}
      isZeroPaddingTop={true}
    >
      <Button
        preset="plain"
        tx="ReferralCTAView.ButtonTitle"
        color="likeCyan"
        onPress={props.onPressAction}
      />
    </Sheet>
  )
}

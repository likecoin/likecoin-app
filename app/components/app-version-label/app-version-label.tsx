import React from "react"
import { APP_MARKETING_VERSION, APP_VERSION } from "react-native-dotenv"

import { Text } from "../text"
import { TextProps } from "../text/text.props"

/**
 * A label component to show version
 */
export function AppVersionLabel(props: TextProps) {
  return (
    <Text
      color="greyBlue"
      align="center"
      size="default"
      {...props}
      text={`${APP_MARKETING_VERSION} (build ${APP_VERSION})`}
    />
  )
}

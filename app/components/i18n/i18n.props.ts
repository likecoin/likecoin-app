import * as React from "react"
import {
  TextProps as ReactNativeTextProps,
} from "react-native"

import { TextProps } from "../text"

export interface I18nProps extends ReactNativeTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx: string

  /**
   * The interpolated contents from <Text/>.
   */
  children?: React.ReactElement<TextProps> | React.ReactElement<TextProps>[]
}

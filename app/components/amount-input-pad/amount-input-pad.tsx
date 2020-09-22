import * as React from "react"
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
} from "react-native"
import { splitEvery } from "ramda"

import { AmountInputPadKey } from "./amount-input-pad.key"
import DeleteIcon from "./delete-key.svg"

import { Icon } from "../icon"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"
import { spacing, color } from "../../theme"

const KEY_LIST = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  ".", "0",
]

const STYLE = StyleSheet.create({
  DISPLAY_VALUE: {
    fontSize: 32,
    height: 40,
    marginVertical: spacing[2],
  } as TextStyle,
  DISPLAY_VALUE_ROW: {
    flexGrow: 1,
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  } as ViewStyle,
  KEY_ROW: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,
})

export interface AmountInputPadProps {
  /**
   * The value of the input
   */
  value?: string

  /**
   * The error description to display if not using `tx`.
   */
  errorText?: string

  /**
   * The error description which is looked up via i18n.
   */
  errorTx?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * The callback when the input is changed
   */
  onChange?: (value: string) => void
}

/**
 * Number pad for input LIKE amount
 */
export class AmountInputPad extends React.Component<AmountInputPadProps, {}> {
  private onChange = (value: string) => {
    const callback = this.props.onChange
    if (callback) {
      callback(value)
    }
  }

  private onPressKey = (key: string) => {
    const { value } = this.props
    if (key === "." && value.includes(key)) return
    this.onChange(value === "0" && key !== "." ? key : value.concat(key))
  }

  private onPressDelete = () => {
    const { value } = this.props
    this.onChange(value.length === 1 ? "0" : value.slice(0, -1))
  }

  render() {
    const {
      errorText,
      errorTx,
      style,
      value,
      ...rest
    } = this.props

    return (
      <View style={style} {...rest}>
        <View style={STYLE.DISPLAY_VALUE_ROW}>
          <Text
            text="LIKE"
            align="center"
            color="grey4a"
            size="medium"
            weight="bold"
          />
          <Text
            text={value}
            align="center"
            color="likeGreen"
            weight="bold"
            minimumFontScale={0.5}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={STYLE.DISPLAY_VALUE}
          />
          <Text
            tx={errorTx}
            text={errorText}
            isHidden={!(errorTx || errorText)}
            color="angry"
            prepend={
              <Icon
                name="alert-circle"
                color="angry"
                width={sizes.medium}
                height={sizes.medium}
              />
            }
          />
        </View>
        <View>
          {this.renderKeys()}
        </View>
      </View>
    )
  }

  private renderKeys = () => splitEvery(3, [
    ...KEY_LIST.map(value =>
      <AmountInputPadKey
        key={value}
        value={value}
        onPressKey={this.onPressKey}
      />
    ),
    <AmountInputPadKey
      key="del"
      onPress={this.onPressDelete}
    >
      <DeleteIcon
        width={24}
        height={24}
        fill={color.palette.likeGreen}
      />
    </AmountInputPadKey>
  ]).map((children, key) => (
    <View
      key={key}
      style={STYLE.KEY_ROW}
    >
      {children}
    </View>
  ))
}

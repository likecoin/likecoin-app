import * as React from "react"
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
} from "react-native"
import { Icon } from "react-native-ui-kitten"
import { splitEvery } from "ramda"

import { AmountInputPadKey } from "./amount-input-pad.key"
import DeleteIcon from "./delete-key.svg"

import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"
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
    paddingTop: spacing[5],
    paddingBottom: spacing[6]
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
  state = {
    displayValue: `${this.props.value}`,
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (this.state.displayValue !== prevState.displayValue) {
      this._onChange(this.state.displayValue)
    }
  }

  _onChange = (value: string) => {
    const callback = this.props.onChange
    if (callback) {
      callback(value)
    }
  }

  _onPressKey = (key: string) => {
    const { displayValue } = this.state
    if (key === "." && displayValue.includes(key)) return
    this.setState({
      displayValue: displayValue === "0" && key !== "." ? key : displayValue.concat(key),
    })
  }

  _onPressDelete = () => {
    const { displayValue } = this.state
    this.setState({
      displayValue: displayValue.length === 1 ? "0" : displayValue.slice(0, -1),
    })
  }

  render() {
    const {
      errorText,
      errorTx,
      style,
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
            text={this.state.displayValue}
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
                fill={color.error}
                width={sizes.medium}
                height={sizes.medium}
              />
            }
          />
        </View>
        <View>
          {this._renderKeys()}
        </View>
      </View>
    )
  }

  _renderKeys = () => splitEvery(3, [
    ...KEY_LIST.map(value =>
      <AmountInputPadKey
        key={value}
        value={value}
        onPressKey={this._onPressKey}
      />
    ),
    <AmountInputPadKey
      key="del"
      onPress={this._onPressDelete}
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

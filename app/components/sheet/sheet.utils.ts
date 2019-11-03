import React, {
  ReactNode,
} from "react"
import {
  StyleSheet,
  ViewProps,
  TextProps,
} from "react-native"

import { presets } from "./sheet.presets"
import { parseNumber, sum } from "../../utils/number"

interface InjectStyleOptions {
  isZeroPaddingTop: boolean | string
  isZeroPaddingBottom: boolean | string
}

function injectStyleToProps(
  props: ViewProps | TextProps,
  position: "top" | "bottom" | "both",
  options: InjectStyleOptions = {
    isZeroPaddingTop: false,
    isZeroPaddingBottom: false,
  },
): ViewProps | TextProps {
  const {
    padding,
    paddingVertical,
    ...style
  } = StyleSheet.flatten(props.style || {})

  // Split padding values into top and bottom
  if (padding) {
    style.paddingTop = style.paddingBottom = parseNumber(padding)
  }
  if (paddingVertical) {
    style.paddingTop = style.paddingBottom = parseNumber(paddingVertical)
  }

  // Inject style
  const radius = presets.flat.borderRadius
  if (position === "top" || position === "both") {
    if (!options.isZeroPaddingTop) {
      style.paddingTop = sum(style.paddingTop, radius)
    }
    style.borderTopLeftRadius = style.borderTopRightRadius = radius
  }
  if (position === "bottom" || position === "both") {
    if (!options.isZeroPaddingBottom) {
      style.paddingBottom = sum(style.paddingBottom, radius)
    }
    style.borderBottomLeftRadius = style.borderBottomRightRadius = radius
  }

  return {
    ...props,
    style,
  }
}

function injectStyleToChild(
  child: ReactNode,
  position: "top" | "bottom" | "both",
  options: InjectStyleOptions,
): ReactNode {
  if (!React.isValidElement(child)) return child
  return React.cloneElement(
    child,
    injectStyleToProps(child.props, position, options),
  )
}

export function injectStyle(
  children: ReactNode,
  options: InjectStyleOptions,
): ReactNode {
  const count = React.Children.count(children)
  if (count > 0) {
    return React.Children.map(children, (child, index) => {
      if (index === 0) {
        return injectStyleToChild(child, "top", options)
      } else if (index === count - 1) {
        return injectStyleToChild(child, "bottom", options)
      }
      return child
    })
  }
  return injectStyleToChild(children, "both", options)
}

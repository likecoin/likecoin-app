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

function injectStyleToProps(
  props: ViewProps | TextProps,
  position: "top" | "bottom" | "both",
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
    style.paddingTop = sum(style.paddingTop, radius)
    style.borderTopLeftRadius = style.borderTopRightRadius = radius
  }
  if (position === "bottom" || position === "both") {
    style.paddingBottom = sum(style.paddingBottom, radius)
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
): ReactNode {
  if (!React.isValidElement(child)) return child
  return React.cloneElement(
    child,
    injectStyleToProps(child.props, position),
  )
}

export function injectStyle(children: ReactNode): ReactNode {
  const count = React.Children.count(children)
  if (count > 0) {
    return React.Children.map(children, (child, index) => {
      if (index === 0) {
        return injectStyleToChild(child, "top")
      } else if (index === count - 1) {
        return injectStyleToChild(child, "bottom")
      }
      return child
    })
  }
  return injectStyleToChild(children, "both")
}

import * as React from "react"
import { View, ViewProps, ViewStyle } from "react-native"
import ImageSequence from "react-native-image-sequence"

// TODO: Better way to import these
const images = [
  require("./frames/1.png"),
  require("./frames/2.png"),
  require("./frames/3.png"),
  require("./frames/4.png"),
  require("./frames/5.png"),
  require("./frames/6.png"),
  require("./frames/7.png"),
  require("./frames/8.png"),
  require("./frames/9.png"),
]

const ROOT: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const SIZE = 48;

const IMAGE: ViewStyle = {
  width: SIZE,
  height: SIZE,
}

export function LoadingLikeCoin(props: ViewProps) {
  const { style, ...restProps } = props
  const rootStyle = [ROOT, style]
  return (
    <View style={rootStyle} {...restProps}>
      <ImageSequence
        images={images}
        framesPerSecond={12}
        {...{ style: IMAGE }}
      />
    </View>
  )
}

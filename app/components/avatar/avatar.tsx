import * as React from "react"
import { View, ViewStyle, Image, ImageStyle, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { AvatarProps as Props } from "./avatar.props"
import { AvatarStyle as Style } from "./avatar.style"
import CivicLikerHalo from "./civic-liker-halo.svg"

import { gradient } from "../../theme"

/**
 * Avatar for Liker
 */
function AvatarComponent(props: Props) {
  const { src, size, isCivicLiker, style, ...rest } = props

  const rootStyle = React.useMemo(
    () => [Style.Root, style],
    [style]
  )

  const imageStyle = React.useMemo(
    () => StyleSheet.flatten([
      Style.Image,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      } as ImageStyle
    ]),
    [size]
  )

  const gradientStyle = React.useMemo(
    () => [
      Style.Gradient,
      {
        borderRadius: imageStyle.borderRadius + Style.Gradient.borderWidth,
      } as ViewStyle,
    ],
    [size]
  )

  return (
    <View style={rootStyle} {...rest}>
      <LinearGradient
        colors={gradient.LikeCoin}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={gradientStyle}
      >
        <Image
          style={imageStyle}
          source={{ uri: src }}
        />
      </LinearGradient>
      {isCivicLiker && <CivicLikerHalo style={Style.Halo} />}
    </View>
  )
}

AvatarComponent.displayName = "Avatar"

AvatarComponent.defaultProps = {
  size: 64,
} as Partial<Props>

export const Avatar = React.memo(AvatarComponent)

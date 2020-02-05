import * as React from "react"
import { View, ViewStyle, Image, ImageStyle, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { AvatarProps as Props } from "./avatar.props"
import { AvatarStyle as Style } from "./avatar.style"
import CivicLikerHalo from "./civic-liker-halo.svg"
import CivicLikerSmallHalo from "./civic-liker-halo-small.svg"

import { color, gradient } from "../../theme"

/**
 * Avatar for Liker
 */
function AvatarComponent(props: Props) {
  const { focused, src, size, isCivicLiker, style, ...rest } = props
  const isLarge = size > 42

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
    () => {
      const style = isLarge ? Style.GradientLarge : Style.GradientSmall
      return [
        Style.GradientBase,
        style,
        {
          borderRadius: imageStyle.borderRadius + style.borderWidth,
        } as ViewStyle,
      ]
    },
    [size]
  )

  const gradientColors = React.useMemo(
    () =>
      focused ? (
        [color.palette.likeCyan, color.palette.likeCyan]
      ) : (
        gradient.LikeCoin
      ),
    [focused]
  )

  const HaloComponent = isLarge ? CivicLikerHalo : CivicLikerSmallHalo

  return (
    <View style={rootStyle} {...rest}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={gradientStyle}
      >
        <Image
          style={imageStyle}
          source={{ uri: src }}
        />
      </LinearGradient>
      {isCivicLiker &&
        <HaloComponent
          fill="#40BFA5"
          style={Style.Halo}
        />
      }
    </View>
  )
}

AvatarComponent.displayName = "Avatar"

AvatarComponent.defaultProps = {
  size: 64,
} as Partial<Props>

export const Avatar = React.memo(AvatarComponent)

import * as React from "react"
import { ImageStyle, View, ViewStyle, StyleSheet } from "react-native"
import Svg, { Path } from "react-native-svg"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"

import { color, gradient, spacing } from "../../theme"

import { AvatarProps as Props } from "./avatar.props"
import { AvatarStyle as Style } from "./avatar.style"

const LARGE_SIZE_MIN = 42

/**
 * Avatar for Liker
 */
function AvatarComponent(props: Props) {
  const { focused, src, size, isCivicLiker, style, ...rest } = props
  const isLarge = size > LARGE_SIZE_MIN

  const rootStyle = React.useMemo(() => [Style.Root, style], [style])

  const imageStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        Style.Image,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        } as ImageStyle,
      ]),
    [size],
  )

  const gradientStyle = React.useMemo(() => {
    const style = isLarge ? Style.GradientLarge : Style.GradientSmall
    return [
      Style.GradientBase,
      style,
      {
        margin: (spacing[1] / LARGE_SIZE_MIN) * size,
        borderRadius: imageStyle.borderRadius + style.borderWidth,
      } as ViewStyle,
    ]
  }, [size])

  const gradientColors = React.useMemo(
    () =>
      focused
        ? [color.palette.likeCyan, color.palette.likeCyan]
        : gradient.LikeCoin,
    [focused],
  )

  const haloSize = isLarge ? 64 : 42
  const haloPath = isLarge
    ? "M18.16 3a1.09 1.09 0 01.84-.06.06.06 0 010 .06l-.11.34a.05.05 0 01-.07 0 .64.64 0 00-.45 0 .62.62 0 00-.27.85.61.61 0 00.84.3.64.64 0 00.31-.32.07.07 0 01.07 0l.34.13a.06.06 0 010 .08 1.1 1.1 0 01-.55.61 1.14 1.14 0 11-1-2zm2.08-.8a.06.06 0 010-.08l.38-.12a.07.07 0 01.08 0l.75 2a.06.06 0 010 .08l-.35.14a.07.07 0 01-.08 0zM22 1.59a.05.05 0 010-.09l.4-.12h.06l.82 1 .18-1.25a.05.05 0 010-.05l.4-.11C24 .92 24 1 24 1l-.35 2.31h-.06zm3.3-.9V.62l.37-.08a.06.06 0 01.07 0l.42 2a.06.06 0 01-.05.07l-.37.08a.08.08 0 01-.07 0zm3-.58a1 1 0 01.79.2.07.07 0 010 .09l-.22.28a.06.06 0 01-.08 0 .61.61 0 00-.44-.11.63.63 0 00-.54.71.64.64 0 00.69.57.72.72 0 00.41-.2.06.06 0 01.08 0l.27.23a.06.06 0 010 .09 1.08 1.08 0 01-.73.39 1.14 1.14 0 01-1.26-1A1.14 1.14 0 0128.34.11zm2.73 1.25A.34.34 0 0131.4 1a.34.34 0 01.35.33.34.34 0 01-.34.34.34.34 0 01-.34-.31zm2.76-1.3s0-.06.07-.06h.37a.05.05 0 01.05.06l-.12 1.68.75.06a.06.06 0 01.05.06v.34a.07.07 0 01-.07.06l-1.2-.06s-.06 0-.06-.07zm2.68.27a.06.06 0 01.06 0l.38.06s.05 0 .05.07l-.32 2.06a.06.06 0 01-.06 0l-.38-.06s-.05 0-.05-.07zm2.08.38a.07.07 0 01.09 0l.36.03a.1.1 0 01.06.1l-.2.8.89-.64h.45a.08.08 0 010 .13l-.93.72.54 1.21a.08.08 0 01-.09.1l-.42-.1-.48-1.13-.22.91a.08.08 0 01-.09.06l-.36-.09a.07.07 0 010-.09zm3.12.83a.06.06 0 01.07 0l1.26.39A.06.06 0 0143 2l-.11.32a.06.06 0 01-.08 0L42 2.08l-.13.37.68.23a.07.07 0 010 .08l-.12.33a.05.05 0 01-.07 0l-.68-.23-.14.4.82.28a.06.06 0 010 .08l-.03.38a.06.06 0 01-.08 0L41 3.58a.06.06 0 010-.07zm3.26 2.24a.27.27 0 00.33-.13.25.25 0 00-.12-.32l-.43-.2-.2.45zm-.5-1.21a.06.06 0 01.08 0l.85.4A.67.67 0 0145 4.22l.06.91s0 .09-.09.06L44.6 5v-.93L44.34 4l-.34.68a.06.06 0 01-.08 0l-.34-.15a.07.07 0 010-.08zM5.7 15.35a.66.66 0 01-.35-.11.64.64 0 01-.19-.89A31.4 31.4 0 0114.52 5a.64.64 0 01.7 1.08 30.5 30.5 0 00-9 9 .65.65 0 01-.52.27zm-4.13 9.5a.44.44 0 01-.16 0 .64.64 0 01-.47-.78 31.78 31.78 0 012.25-6.21.64.64 0 01.86-.3.65.65 0 01.3.87 30.64 30.64 0 00-2.15 5.93.66.66 0 01-.63.49zm8.14 29.43a.67.67 0 01-.47-.2A31.64 31.64 0 010 31.72a.65.65 0 011.3 0 30.36 30.36 0 008.87 21.45.66.66 0 01-.46 1.11zM12 56.34a.66.66 0 01-.42-.15l-.62-.54a.64.64 0 01.85-1l.6.51a.64.64 0 01.09.91.65.65 0 01-.5.27zm19.88 7.26a31.51 31.51 0 01-18.58-6 .65.65 0 11.76-1.05 30.35 30.35 0 0039.28-3.09.66.66 0 01.92 0 .65.65 0 010 .92 31.64 31.64 0 01-22.38 9.22zm26.18-14.3a.66.66 0 01-.35-.11.65.65 0 01-.19-.9 30.37 30.37 0 002.24-29.12.65.65 0 111.18-.53A31.64 31.64 0 0158.61 49a.68.68 0 01-.55.3zM57.79 15a.65.65 0 01-.54-.29 30.37 30.37 0 00-8.72-8.59.65.65 0 11.71-1.12 31.63 31.63 0 019.09 9 .65.65 0 01-.18.9.66.66 0 01-.36.1z"
    : "M1.16 16.57a.3.3 0 01-.13 0 .56.56 0 01-.41-.68 20.41 20.41 0 011.47-4.09.56.56 0 01.75-.26.57.57 0 01.27.75 19.72 19.72 0 00-1.4 3.85.56.56 0 01-.55.43m5.16 19a.58.58 0 01-.41-.17A20.81 20.81 0 010 20.91a.57.57 0 01.56-.57.57.57 0 01.57.57 19.65 19.65 0 005.59 13.73.57.57 0 010 .8.59.59 0 01-.39.16m1.61 1.5a.54.54 0 01-.37-.1l-.41-.35a.56.56 0 01.74-.84l.39.33a.56.56 0 01.07.79.54.54 0 01-.43.21M38 32.51a.59.59 0 01-.31-.09.56.56 0 01-.16-.78A19.71 19.71 0 0039 12.79a.57.57 0 011-.47 20.82 20.82 0 01-1.54 19.93.56.56 0 01-.47.26m-17.07 9.32A20.68 20.68 0 018.89 38a.56.56 0 01-.14-.79.57.57 0 01.79-.13A19.63 19.63 0 0034.81 35a.57.57 0 01.8 0 .55.55 0 010 .79 20.76 20.76 0 01-14.68 6.08m16.88-31.75a.57.57 0 01-.47-.25 19.53 19.53 0 00-5.64-5.56.56.56 0 01.61-.95 20.77 20.77 0 016 5.88.56.56 0 01-.15.78.55.55 0 01-.32.1m-33.92.22a.5.5 0 01-.31-.1.56.56 0 01-.16-.78A20.87 20.87 0 0120.92 0a20.64 20.64 0 019.42 2.24.55.55 0 01.25.75.56.56 0 01-.76.25 19.85 19.85 0 00-18.16.18 19.91 19.91 0 00-7.31 6.66.56.56 0 01-.47.26"

  return (
    <View style={rootStyle} {...rest}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={gradientStyle}
      >
        <FastImage style={imageStyle} source={{ uri: src }} />
      </LinearGradient>
      {!!isCivicLiker && (
        <View style={Style.Halo}>
          <Svg
            viewBox={`0 0 ${haloSize} ${haloSize}`}
            fill="#40BFA5"
          >
            <Path d={haloPath} />
          </Svg>
        </View>
      )}
    </View>
  )
}

AvatarComponent.displayName = "Avatar"

AvatarComponent.defaultProps = {
  size: 64,
} as Partial<Props>

export const Avatar = React.memo(AvatarComponent)

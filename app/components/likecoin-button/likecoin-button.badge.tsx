import * as React from "react"
import { Circle, G, Path, Symbol, Text } from "react-native-svg"

import { color } from "../../theme"

interface LikeCoinButtonBadgeProps {
  likeCount?: number
  hasSuperLiked?: boolean
  isSuperLikeMode?: boolean
}

export function LikeCoinButtonBadge({
  likeCount = 0,  
  hasSuperLiked = false,
  isSuperLikeMode = false,
}: LikeCoinButtonBadgeProps) {
  if (!isSuperLikeMode && likeCount === 0) return null

  const backgroundColor = isSuperLikeMode && !hasSuperLiked
    ? color.palette.offWhite
    : color.palette.lighterCyan
  const strokeColor = isSuperLikeMode && !hasSuperLiked
    ? color.palette.grey9b
    : color.palette.likeGreen

  return (
    <Symbol
      id="badge"
      viewBox="0 0 36 36"
    >
      <G>
        <Circle
          cx={18}
          cy={18}
          r={18}
          fill={backgroundColor}
        />
        {isSuperLikeMode ? (
          <G fill={strokeColor}>
            <Path d="M13.13 15.11a2 2 0 10-2-2 2 2 0 002 2zM11 19.51a1.23 1.23 0 011.08-1.24 7.23 7.23 0 006.19-6.19 1.25 1.25 0 112.48.34 9.76 9.76 0 01-8.34 8.33A1.25 1.25 0 0111 19.68a1 1 0 010-.17z" />
            <Path d="M11 24.8a1.24 1.24 0 011.15-1.24 12.42 12.42 0 0011.43-11.41 1.25 1.25 0 012.5.2 14.93 14.93 0 01-13.73 13.7A1.25 1.25 0 0111 24.91z" />
          </G>
        ) : (
          <Text
            x={13}
            y={24}
            fill={strokeColor}
            fontWeight={700}
            fontSize={18}
          >
            {likeCount}
          </Text>
        )}
      </G>
    </Symbol>
  )
}
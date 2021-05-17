import * as React from "react"
import Svg, {
  Defs,
  ClipPath,
  Path,
  Circle,
  G,
  Use,
  Rect,
} from "react-native-svg"
import styled from "styled-components/native"

import { color as Colors } from "../../theme"

import { LikeCoinButtonBadge } from "./likecoin-button.badge";
import { LikeCoinButtonCooldownRing } from "./likecoin-button.cooldown-ring";

const VIEW_BOX_SIZE = 156;
const BUTTON_SIZE = 78; 

interface PureLikeCoinButtonRootProps {
  margin?: number
}

const PureButtonRoot = styled(Svg)<PureLikeCoinButtonRootProps>`
  margin: -${props => props.margin}px;
`

export interface PureLikeCoinButtonProps {
  /**
   * The size of the button, default 48
   */
  size?: number

  /**
   * Like count display in the badge
   */
  likeCount?: number

  /**
   * Whether user has the ability to Super Like
   */
  isSuperLikeEnabled?: boolean

  /**
   * Whether user has Super Liked before
   */
  hasSuperLiked?: boolean

  /**
   * Whether user can Super Like now
   */
  canSuperLike?: boolean

  /**
   * Cooldown value display in the ring
   */
  cooldownValue?: number

  /**
   * Timestamp when cooldown end
   */
  cooldownEndTime?: number
}

/**
 * Stateless LikeCoin button
 */
export function PureLikeCoinButton({
  size = BUTTON_SIZE,
  likeCount = 0,
  isSuperLikeEnabled = false,
  canSuperLike = false,
  hasSuperLiked = false,
  cooldownValue = 0,
  cooldownEndTime = 0,
}: PureLikeCoinButtonProps) {
  const margin = (VIEW_BOX_SIZE - BUTTON_SIZE) / 2 * size / BUTTON_SIZE
  const width = VIEW_BOX_SIZE * size / BUTTON_SIZE

  const hasLiked = likeCount > 0
  const isSuperLikeMode = hasSuperLiked || likeCount >= 5
  const isShowBadge = isSuperLikeMode || hasLiked
  const isSuperLikable = canSuperLike && !cooldownValue

  const buttonBackgroundColor = isSuperLikeMode && !isSuperLikable
    ? Colors.palette.white
    : Colors.palette.lighterCyan

  const cooldownRingValue = isSuperLikeMode && isSuperLikeEnabled && cooldownValue > 0 ? cooldownValue : 0
  const cooldownRingColor = React.useMemo(() => {
    if (isSuperLikeMode) {
      if (isSuperLikeEnabled || isSuperLikable) return Colors.palette.likeCyan
      return Colors.palette.grey4a
    }
    if (hasLiked) return Colors.palette.likeGreen
    return Colors.palette.likeCyan
  }, [isSuperLikeMode, isSuperLikeEnabled, isSuperLikable, hasLiked])

  const buttonSymbol = React.useMemo(() => {
    if (isSuperLikeMode) {
      return (
        <G
          fill="none"
          stroke={isSuperLikable ? Colors.palette.likeGreen : Colors.palette.offWhite}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Star */}
          <Path d="M80 65.38l2.62 5.3a2.27 2.27 0 001.69 1.23l5.85.85a2.25 2.25 0 011.25 3.84l-4.23 4.12a2.24 2.24 0 00-.65 2l1 5.83a2.25 2.25 0 01-3.27 2.37L79 88.16a2.27 2.27 0 00-2.09 0l-5.23 2.75a2.25 2.25 0 01-3.27-2.37l1-5.83a2.24 2.24 0 00-.65-2l-4.25-4.11a2.25 2.25 0 011.25-3.84l5.85-.85a2.27 2.27 0 001.69-1.23l2.62-5.3a2.25 2.25 0 014.08 0z" />

          {/* TODO: Tick animation */}
          {/* <Path
            stroke={Colors.palette.likeGreen}
            d="M73.38 80.35l3.3 2.83 6.12-7.42"
          /> */}

          {/* Star Stripe */}
          <Path d="M72 98v4M84 98v4M78 100v4" />
        </G>
      )
    }
    return (
      <Path
        d="M75.1 69.7a1.09 1.09 0 01-.9-.4 1.24 1.24 0 01.1-1.7 25.87 25.87 0 005.2-5.9 4.41 4.41 0 014.3-2.4 1.22 1.22 0 11-.4 2.4 2.11 2.11 0 00-1.9 1.2 29.54 29.54 0 01-5.7 6.6 1.45 1.45 0 01-.7.2M54.6 90.1a1.09 1.09 0 01-.9-.4 1.16 1.16 0 01.2-1.7 29.17 29.17 0 014.5-3 1.19 1.19 0 111.1 2.1 35.24 35.24 0 00-4 2.7 1.9 1.9 0 01-.9.3m30.6-11.4c.5.4 1 .3 1.6-.2a45 45 0 008.5-11.3 1.12 1.12 0 011.4-.7c.7.3.7 1.4.1 2.7a44 44 0 01-8.3 11.6 1 1 0 000 1.4c.4.4 1 .3 1.6-.3a48.69 48.69 0 005.2-6 1.13 1.13 0 011.2-.6c.6.1.7.7.5 1.3-.3 1.1-3.4 5.1-4.6 6.4-3.3 3.7-6.6 5.7-13 8.9-2.2 1.1-3.9 2.2-4.9 3.9-.9 1.5-1.2 2-1.3 2.2a1.42 1.42 0 00.7 2 1.27 1.27 0 00.6.1 1.51 1.51 0 001.4-.9l1.1-2a8.74 8.74 0 013.7-3.3 37.77 37.77 0 0012.7-8.8 42.16 42.16 0 004.6-6.3c1.8-3 .8-5.5-.8-5.9a.19.19 0 01-.1-.3 16 16 0 002-4.7c.3-1.5-.1-3.4-2.2-3.9-.1 0-.2-.1-.2-.3.1-.5.3-1.1.4-1.5a3.38 3.38 0 00-2.4-4.1 3.7 3.7 0 00-2.9.6.3.3 0 01-.4 0 2 2 0 00-1.6-.7 3.69 3.69 0 00-3.6 2.4 24.75 24.75 0 01-4.7 6.7 51.91 51.91 0 01-9 7.6c-.4.3-1 .2-.9-.3.1-.9 1.1-6.8 1.2-8.6.3-2.8-1.3-4.1-3-4.4-1.4-.2-3.6.2-4.8 3.4a82.33 82.33 0 00-3.4 10 29.52 29.52 0 00-.2 12.3 1.08 1.08 0 01-.2.8c-.9 1.5-2.3 3.6-3.1 5.3a1.43 1.43 0 00.6 1.9 1.85 1.85 0 00.7.2 1.51 1.51 0 001.4-.9c.5-1 1.4-2.8 1.8-3.5a20.83 20.83 0 001.2-2.7 3.71 3.71 0 000-2.4 23.82 23.82 0 01.2-9.9 96.1 96.1 0 013.6-11.1c.4-.9.9-1.2 1.4-1.1s1.5.3 1.2 2.1c-.5 3.3-1.2 7.4-1.4 8.8-.1.7-.2 2.3 1 3 1 .6 2.1.3 3.3-.5a59.55 59.55 0 0010.3-8.7 21.65 21.65 0 004.8-7.3 1.4 1.4 0 011.6-.7c.3.1.7.5.4 1.5-.7 2.3-3.5 7.4-8.9 12.3a1 1 0 00-.2 1.5 1.07 1.07 0 001.5 0A35.09 35.09 0 0091.5 64a25.54 25.54 0 001.1-2.7 1.38 1.38 0 011.3-1c.6.1 1 .7.8 1.7a23.94 23.94 0 01-1.3 3.7A51.66 51.66 0 0185 77.1a1.38 1.38 0 00.2 1.6m-22-16.4a.51.51 0 00.1-.5c-.3-.8-1.8-4.3-2.1-5-.2-.3-.4-.4-.7-.3a6.29 6.29 0 00-1.5 1 6 6 0 00-1.2 1.3.53.53 0 00.2.7 53 53 0 004.7 2.8.33.33 0 00.5 0zm-1.3 2.3c0-.2-.3-.3-.4-.3-.9-.2-4.6-.7-5.4-.8-.4 0-.6.2-.6.4a6.05 6.05 0 00.1 1.8 5.85 5.85 0 00.5 1.7.48.48 0 00.7.2c.7-.3 4.1-2.1 4.8-2.6.1 0 .3-.1.3-.4zM90.1 93c-.2 0-.3.2-.4.4-.3.8-1.2 4.5-1.4 5.3a.53.53 0 00.4.7 8.16 8.16 0 001.8.1 5.94 5.94 0 001.8-.3c.3-.1.4-.3.3-.7a31.15 31.15 0 00-2.1-5c0-.3-.1-.5-.4-.5zm2.2-1.7a.44.44 0 00.1.5 46.83 46.83 0 003.8 3.9.52.52 0 00.8 0 5.4 5.4 0 001-1.5 12.83 12.83 0 00.7-1.6c0-.3-.1-.5-.5-.6-.8-.2-4.5-.8-5.4-.9-.2 0-.4 0-.5.2z"
        fill={Colors.palette.likeGreen}
      />
    )
  }, [isSuperLikeMode, isSuperLikable])

  return (
    <PureButtonRoot
      viewBox="0 0 156 156"
      width={width}
      height={width}
      margin={margin}
    >
      <Defs>
        <ClipPath id="button-mask">
          {isShowBadge ? (
            <Path d="M0 0v156h156V0zm120 132a22 22 0 1122-22 22 22 0 01-22 22z" />
          ) : (
            <Rect
              width={VIEW_BOX_SIZE}
              height={VIEW_BOX_SIZE}
            />
          )}
        </ClipPath>
      </Defs>
      
      <LikeCoinButtonBadge
        likeCount={likeCount}
        isSuperLikeMode={isSuperLikeMode}
        hasSuperLiked={hasSuperLiked}
      />

      <G clipPath="url(#button-mask)">
        <Circle
          r={38}
          cx={78}
          cy={78}
          fill={buttonBackgroundColor}
        />
        {buttonSymbol}

        <LikeCoinButtonCooldownRing
          value={cooldownRingValue}
          color={cooldownRingColor}
          endTime={cooldownEndTime}
        />
      </G>

      {isShowBadge && (
        <Use href="#badge" x={102} y={92} width={36} height={36} />
      )}
    </PureButtonRoot>
  )
}

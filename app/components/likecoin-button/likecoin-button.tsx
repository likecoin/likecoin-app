import * as React from "react"
import { View, TouchableOpacity } from "react-native"
import { useDebouncedCallback } from 'use-debounce';

import { PureLikeCoinButton, PureLikeCoinButtonProps } from "./pure-likecoin-button";

export interface LikecoinButtonProps extends PureLikeCoinButtonProps {
  /**
   * Callback on pressed like
   */
  onPressLike?: (likeCount: number) => void

  /**
   * Callback on triggered Super Like
   */
  onPressSuperLike?: () => void
}

/**
 * LikeCoin Button
 */
export function LikeCoinButton({
  size,
  likeCount: prevLikeCount = 0,
  isSuperLikeEnabled = false,
  hasSuperLiked = false,
  canSuperLike = false,
  cooldownValue = 0,
  cooldownEndTime = 0,
  isTesting = false,
  onPressLike,
  onPressSuperLike,
  ...props
}: LikecoinButtonProps) {
  const [likeCount, setLikeCount] = React.useState(prevLikeCount)

  React.useEffect(() => {
    if (likeCount > prevLikeCount) return
    setLikeCount(prevLikeCount)
  }, [prevLikeCount])

  const handlePressLike = useDebouncedCallback((hits: number) => {
    if (onPressLike) onPressLike(hits)
  }, 500)

  const handlePressSuperLike = useDebouncedCallback(() => {
    if (onPressSuperLike) onPressSuperLike()
  }, 500)

  const handlePress = () => {
    if (likeCount < 5) {
      const nextLikeCount = likeCount + 1
      setLikeCount(nextLikeCount)
      handlePressLike(nextLikeCount - prevLikeCount)
    } else if (canSuperLike) {
      handlePressSuperLike()
    }
  }
  return (
    <View {...props}>
      <TouchableOpacity onPress={handlePress}>
        <PureLikeCoinButton
          size={size}
          likeCount={likeCount}
          isSuperLikeEnabled={isSuperLikeEnabled}
          canSuperLike={canSuperLike}
          hasSuperLiked={hasSuperLiked}
          cooldownValue={cooldownValue}
          cooldownEndTime={cooldownEndTime}
          isTesting={isTesting}
        />
      </TouchableOpacity>
    </View>
  )
}

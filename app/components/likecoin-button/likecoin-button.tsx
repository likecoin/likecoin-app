import * as React from "react"
import { View, TouchableOpacity } from "react-native"
import { useDebouncedCallback } from 'use-debounce';

import { PureLikeCoinButton, PureLikeCoinButtonProps } from "./pure-likecoin-button";

export interface LikecoinButtonProps extends PureLikeCoinButtonProps {
  /**
   * Disable button action
   */
  isDisabled?: boolean

  /**
   * Callback on pressed like (debounced)
   */
  onPressLikeDebounced?: (likeCount: number) => void

  /**
   * Callback on triggered Super Like (debounced)
   */
  onPressSuperLikeDebounced?: () => void

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
  isDisabled = false,
  onPressLike,
  onPressLikeDebounced,
  onPressSuperLike,
  onPressSuperLikeDebounced,
  ...props
}: LikecoinButtonProps) {
  const [likeCount, setLikeCount] = React.useState(prevLikeCount)

  React.useEffect(() => {
    if (likeCount > prevLikeCount) return
    setLikeCount(prevLikeCount)
  }, [prevLikeCount])

  const debouncedPressLike = useDebouncedCallback((hits: number) => {
    if (onPressLikeDebounced) onPressLikeDebounced(hits)
  }, 500)

  const debouncedPressSuperLike = useDebouncedCallback(() => {
    if (onPressSuperLikeDebounced) onPressSuperLikeDebounced()
  }, 500)

  const handlePress = () => {
    if (likeCount < 5) {
      const nextLikeCount = likeCount + 1
      const hits = nextLikeCount - prevLikeCount
      if (onPressLike) onPressLike(hits)
      if (isDisabled) return
      setLikeCount(nextLikeCount)
      debouncedPressLike(hits)
    } else if (canSuperLike) {
      if (onPressSuperLike) onPressSuperLike()
      if (isDisabled) return
      debouncedPressSuperLike()
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

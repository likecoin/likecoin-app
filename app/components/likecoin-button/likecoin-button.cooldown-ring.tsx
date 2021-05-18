import * as React from "react"
import { Animated } from "react-native"
import { Circle, G } from "react-native-svg"

import { color as Colors } from "../../theme"

interface LikeCoinButtonCooldownRingProps {
  /**
   * 0 is 100%, 1 is 0% of the progress
   */
  value?: number
  endTime?: number
  center?: number
  radius?: number
  color?: string
  isTesting?: boolean
}

export function LikeCoinButtonCooldownRing({
  value,
  radius = 38,
  center = 78,
  endTime,
  color,
  isTesting = false
}: LikeCoinButtonCooldownRingProps) {
  const circumference = Math.PI * radius * 2

  const progressRef = React.useRef(null)
  const progressAnim = React.useRef(new Animated.Value(1)).current

  const animateProgress = (toValue: number, duration?: number) => {
    return Animated.timing(progressAnim, {
      toValue,
      duration: duration || 3000,
      useNativeDriver: true,
    })
  }

  const isShowProgress = value > 0

  const getStrokeDashoffset = (v: number) => Math.min(1, Math.max(0, v)) * circumference

  React.useEffect(() => {
    if (isTesting || value === 0) return
    animateProgress(value).start(() => {
      if (!endTime) return
      animateProgress(0, endTime - Date.now()).start()
    })
  }, [isTesting, value, endTime])

  React.useEffect(() => {
    progressAnim.addListener(({ value: animValue }) => {
      if (progressRef?.current) {
        const strokeDashoffset = getStrokeDashoffset(animValue)
        progressRef.current.setNativeProps({ strokeDashoffset })
      }
    })
  }, [circumference])

  return (
    <G
      fill="none"
      strokeLinecap="round"
      strokeWidth={4}
    >
      <Circle
        r={radius}
        cx={center}
        cy={center}
        stroke={isShowProgress ? Colors.palette.offWhite : color}
      />
      {isShowProgress && (<Circle
        ref={progressRef}
        r={radius}
        cx={center}
        cy={center}
        originX={center}
        originY={center}
        rotation={-90}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={isTesting ? getStrokeDashoffset(value) : circumference}
      />)}
    </G>
  )
}
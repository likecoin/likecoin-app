import { ViewStyle } from "react-native"

export interface AvatarProps {
  /**
   * The URL of the avatar
   */
  src: string

  /**
   * The size of the avatar. Default is `64` pt.
   */
  size?: number

  /**
   * Set to `true` to display the Civic Liker halo. Default is `false`
   */
  isCivicLiker?: boolean

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

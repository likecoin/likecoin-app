import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewProps,
} from "react-native"

export interface WrapScrollViewShadowProps extends ViewProps {
  /**
   * Fires at most once per frame during scrolling.
   * The frequency of the events can be contolled using the scrollEventThrottle prop.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

import { ViewProps } from "react-native"

export interface WrapScrollViewShadowProps extends ViewProps {
  onScroll?: () => void
}

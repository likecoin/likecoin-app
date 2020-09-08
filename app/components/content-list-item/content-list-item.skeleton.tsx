import * as React from "react"
import { Dimensions } from "react-native"
import ContentLoader, {
  IContentLoaderProps,
  Rect,
} from "react-content-loader/native"

const PADDING = 24
const TEXT_HEIGHT = 14
const PRIMARY_COLOR = "#F3F3F3"
const SECONDARY_COLOR = "#CCCCCC"

export function ContentListItemSkeleton(props: IContentLoaderProps) {
  const { width } = Dimensions.get("window")
  const {
    speed,
    primaryColor,
    secondaryColor,
  } = props
  return (
    <ContentLoader
      speed={speed || 0.5}
      primaryColor={primaryColor || PRIMARY_COLOR}
      secondaryColor={secondaryColor || SECONDARY_COLOR}
      height={102}
      width={width}
    >
      <Rect x={PADDING} y="12" width="124" height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="34" width={width - PADDING * 2} height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="56" width={width - PADDING * 2} height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="78" width="100" height={TEXT_HEIGHT} />
    </ContentLoader>
  )
}

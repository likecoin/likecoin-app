import React from "react"
import { Dimensions } from "react-native"
import ContentLoader, { Rect } from "react-content-loader/native"

const PADDING = 24
const TEXT_HEIGHT = 14
const PRIMARY_COLOR = "#F3F3F3"
const SECONDARY_COLOR = "#CCCCCC"

export function ContentListItemSkeleton() {
  const { width } = Dimensions.get("window")
  return (
    <ContentLoader
      height={102}
      width={width}
      speed={0.5}
      primaryColor={PRIMARY_COLOR}
      secondaryColor={SECONDARY_COLOR}
    >
      <Rect x={PADDING} y="12" width="124" height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="34" width={width - PADDING * 2} height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="56" width={width - PADDING * 2} height={TEXT_HEIGHT} />
      <Rect x={PADDING} y="78" width="100" height={TEXT_HEIGHT} />
    </ContentLoader>
  )
}

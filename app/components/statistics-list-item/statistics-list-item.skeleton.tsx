import * as React from "react"
import { Dimensions } from "react-native"
import ContentLoader, { Circle, Rect } from "react-content-loader/native"

import { StatisticsListItemType } from "./statistics-list-item.props"
import { StatisticsListItemStyle } from "./statistics-list-item.style"

import { sizes } from "../text/text.sizes"

import { color, spacing } from "../../theme"

const PADDING_TOP = parseInt(StatisticsListItemStyle.Wrapper.paddingTop.toString())
const PADDING_BOTTOM = parseInt(StatisticsListItemStyle.Wrapper.paddingBottom.toString())
const PADDING_X = parseInt(StatisticsListItemStyle.Wrapper.marginHorizontal.toString())
const TEXT_HEIGHT = sizes.medium
const PRIMARY_COLOR = color.palette.greyf2
const SECONDARY_COLOR = color.palette.lighterGrey
const AVATAR_RADIUS = 22

export interface StatisticsListItemSkeletonProps {
  type: StatisticsListItemType
}

export function StatisticsListItemSkeleton({ type }: StatisticsListItemSkeletonProps) {
  const { width } = Dimensions.get("window")
  let height = PADDING_TOP + TEXT_HEIGHT * 3 + spacing[1] + spacing[2] + PADDING_BOTTOM

  switch (type) {
    case "rewarded-daily-content":
      height += TEXT_HEIGHT * 2 + spacing[1] * 2
      break

    case "supported-creator":
      height = PADDING_TOP + AVATAR_RADIUS * 2 + spacing[2] + TEXT_HEIGHT + PADDING_BOTTOM
      break

    default:
      break
  }
  return (
    <ContentLoader
      width={width}
      height={height}
      speed={0.5}
      primaryColor={PRIMARY_COLOR}
      secondaryColor={SECONDARY_COLOR}
    >
      {type === "supported-creator" ? (
        <React.Fragment>
          <Circle
            x={PADDING_X + AVATAR_RADIUS}
            y={PADDING_TOP + AVATAR_RADIUS}
            r={AVATAR_RADIUS}
          />
          <Rect
            x={PADDING_X + AVATAR_RADIUS * 2 + spacing[3]}
            y={PADDING_TOP + TEXT_HEIGHT + spacing[1]}
            width={100}
            height={TEXT_HEIGHT}
          />
          <Rect
            x={PADDING_X}
            y={PADDING_TOP + AVATAR_RADIUS * 2 + spacing[2]}
            width={60}
            height={TEXT_HEIGHT}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Rect
            x={PADDING_X}
            y={PADDING_TOP}
            width={220}
            height={TEXT_HEIGHT}
          />
          <Rect
            x={PADDING_X}
            y={PADDING_TOP + TEXT_HEIGHT + spacing[1]}
            width={160}
            height={TEXT_HEIGHT}
          />
          <Rect
            x={PADDING_X}
            y={PADDING_TOP + TEXT_HEIGHT * 2 + spacing[1] + spacing[2]}
            width={60}
            height={TEXT_HEIGHT}
          />
        </React.Fragment>
      )}
      <Rect
        x={width - PADDING_X - 60}
        y={PADDING_TOP}
        width={60}
        height={TEXT_HEIGHT}
      />
      <Rect
        x={width - PADDING_X - 30}
        y={PADDING_TOP + TEXT_HEIGHT + spacing[1]}
        width={30}
        height={12}
      />
      {type === "rewarded-daily-content" && (
        <React.Fragment>
          <Rect
            x={PADDING_X}
            y={PADDING_TOP + TEXT_HEIGHT * 3 + spacing[1] * 2 + spacing[2]}
            width={72}
            height={TEXT_HEIGHT}
          />
          <Rect
            x={PADDING_X + 24}
            y={PADDING_TOP + TEXT_HEIGHT * 4 + spacing[1] * 3 + spacing[2]}
            width={48}
            height={TEXT_HEIGHT}
          />
        </React.Fragment>
      )}
    </ContentLoader>
  )
}

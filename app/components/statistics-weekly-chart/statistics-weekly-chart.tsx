import * as React from "react"
import { TextStyle, ViewStyle, View } from "react-native"
import {
  Svg,
  Circle,
  ClipPath,
  Defs,
  ForeignObject,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg"

import {
  StatisticsWeeklyChartProps as Props,
  StatisticsWeeklyChartBarProps as BarProps,
  StatisticsWeeklyChartBarData as BarData,
  StatisticsWeeklyChartGridLineProps as GridLineProps,
} from "./statistics-weekly-chart.props"
import {
  StatisticsWeeklyChartStyle as Style,
} from "./statistics-weekly-chart.style"
import { StatisticsChartLegend } from "./statistics-chart-legend"

import { Text } from "../text"

import { color } from "../../theme"

export function StatisticsWeeklyChart(props: Props) {
  const {
    width = 286,
    height = 142,
    data: propsData,
    barRadius = 4,
    barWidth = 14,
    barInterspace = 20,
    chartMarginTop = 16,
    chartMarginBottom = 22,
    chartPaddingTop = 10,
    chartPaddingLeft = barWidth,
    chartPaddingRight = chartPaddingLeft,
    numGridLines = 4,
    strokeWidth = 0.5,
    yUnit = "LIKE",
    legends: propsLegends,
  } = props
  const legends = propsLegends || []
  const data = propsData && propsData.length > 0 ? propsData : new Array<BarData>(7)

  const chartWidth = chartPaddingLeft + data.length * (barWidth + barInterspace) - barInterspace + chartPaddingRight
  const chartHeight = height - strokeWidth * 2 - chartMarginTop - chartMarginBottom
  const numGridRows = numGridLines - 1

  const maxValue = React.useMemo(
    () => {
      let max = data.reduce((tmpMax, { values: [value1 = 0, value2 = 0] }) => {
        return Math.max(tmpMax, value1 + value2)
      }, numGridRows)
      // Increase the max value with visual padding
      max = Math.ceil(max / ((chartHeight - chartPaddingTop) / chartHeight))
      // Return a divisable max
      return max + numGridRows - (max % numGridRows)
    },
    [
      chartHeight,
      chartPaddingTop,
      data,
      numGridLines,
    ]
  )

  const gridLinesProps = React.useMemo(
    () => {
      const linesProps: GridLineProps[] = []
      const rowHeight = chartHeight / numGridRows
      const rowInterval = maxValue / numGridRows
      for (let i = 0; i < numGridLines; i++) {
        const lineValue = rowInterval * (numGridRows - i)
        linesProps.push({
          y: chartMarginTop + (rowHeight * i) + strokeWidth,
          label: `${i + 1 === numGridLines ? yUnit : lineValue}`
        })
      }
      return linesProps
    },
    [
      chartMarginTop,
      chartHeight,
      maxValue,
      numGridLines,
      strokeWidth,
      yUnit,
    ]
  )

  const barsProps = React.useMemo(
    () => data.map(
      ({ values: [value1 = 0, value2 = 0], ...restProps }, i) => {
        const valueSum = value1 + value2
        const height = chartHeight * valueSum / maxValue
        return {
          ...restProps,
          // label: valueSum.toFixed(1), // Show y value instead of x
          x: barWidth + (barWidth + barInterspace) * i,
          y: chartHeight - height,
          height,
          filledHeight: valueSum > 0 ? height * value1 / valueSum : 0,
        } as BarProps
      }
    ),
    [
      data,
      barWidth,
      barInterspace,
      chartHeight,
    ]
  )

  const labelStyle = React.useMemo(() => ({
    width: barWidth * 3,
  }) as TextStyle, [barWidth])

  const defs = []
  const bars = []

  barsProps.forEach((bar, i) => {
    if (bar.height === 0) {}
    const barAbsY = chartMarginTop + strokeWidth + bar.y
    const labelAbsY = barAbsY + bar.height + 4

    const barPath = `
      M ${bar.x + barRadius + strokeWidth} ${barAbsY}
      h ${barWidth - 2 * barRadius}
      a ${barRadius} ${barRadius} 0 0 1 ${barRadius} ${barRadius}
      v ${bar.height}
      h -${barWidth}
      V ${barAbsY + barRadius}
      a ${barRadius} ${barRadius} 0 0 1 ${barRadius} -${barRadius}
      Z
    `
    const barColor = bar.isFocused
      ? Style.BarFocused.backgroundColor
      : Style.Bar.backgroundColor

    const clipPathID = `bar${i + 1}`
    defs.push(
      <ClipPath key={i} id={clipPathID}>
        <Path d={barPath} />
      </ClipPath>
    )
    bars.push(
      <G
        key={i}
        onPress={() => {
          if (props.onPressBar) props.onPressBar(i)
        }}
      >
        <Rect
          x={bar.x - barInterspace / 2}
          width={barWidth + barInterspace}
          y={chartMarginTop}
          height={chartHeight}
          fill="none"
          stroke="none"
        />
        {bar.isFocused && (
          <Rect
            x={bar.x - 2}
            y={0}
            width={barWidth + (2 + strokeWidth) * 2}
            height={height - chartMarginBottom}
            fill="url(#focused)"
            opacity={0.2}
          />
        )}
        {bar.isDimmed && (
          <Path
            d={barPath}
            fill={Style.Root.backgroundColor}
            stroke={Style.Root.backgroundColor}
            strokeMiterlimit={10}
          />
        )}
        {bar.height > 0 && (
          <G clipPath="url(#chart-clip)" opacity={bar.isDimmed ? 0.2 : 1}>
            <Rect
              x={bar.x + strokeWidth}
              y={barAbsY + bar.height - bar.filledHeight}
              width={barWidth}
              height={bar.filledHeight + 1}
              fill={barColor}
              clipPath={`url(#${clipPathID})`}
            />
            <Path
              d={barPath}
              stroke={barColor}
              strokeMiterlimit={10}
            />
          </G>
        )}
        {bar.isMarked && (
          <Circle
            cx={bar.x + barWidth / 2}
            cy={barAbsY - 6 - 1.5}
            r={1.5}
            fill={color.palette.angry}
          />
        )}
        <ForeignObject
          x={bar.x - barWidth}
          y={height - chartMarginBottom + 4}
          width={barWidth * 3}
          height={chartMarginBottom}
        >
          <Text
            text={bar.label}
            color={bar.isHighlighted ? "likeCyan" : "white" }
            weight={bar.isHighlighted ? "bold" : "normal"}
            size="small"
            align="center"
            style={labelStyle}
          />
        </ForeignObject>
        {bar.isHighlighted && (
          <Circle
            cx={bar.x + barWidth / 2}
            cy={labelAbsY + 16}
            r={1.5}
            fill={color.palette.likeCyan}
          />
        )}
      </G>
    )
  })

  const chartStyle: ViewStyle = {
    aspectRatio: width / height,
  }

  return (
    <View style={[Style.Root, props.style]}>
      <Svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={chartStyle}
      >
        <Defs>
          <LinearGradient id="focused" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color.palette.lighterCyan} stopOpacity="0" />
            <Stop offset="25%" stopColor={color.palette.lighterCyan} stopOpacity="1" />
          </LinearGradient>
          {defs}
          <ClipPath id="chart-clip">
            <Rect x={0} y={chartMarginTop} width={chartWidth} height={chartHeight + 1} />
          </ClipPath>
        </Defs>
        <G>
          <G stroke={color.palette.likeCyan} strokeMiterlimit={10} strokeWidth={1}>
            {gridLinesProps.map((lineProps, i) => (
              <G key={i}>
                <Line opacity={0.2} y1={lineProps.y} x2={chartWidth} y2={lineProps.y} />
                <ForeignObject x={chartWidth + 8} y={lineProps.y - 7} width={25} height={14}>
                  <Text
                    text={lineProps.label}
                    size="small"
                    color="greyBlue"
                  />
                </ForeignObject>
              </G>
            ))}
          </G>
          <G>{bars}</G>
        </G>
      </Svg>
      {!!legends && legends.length > 0 && (
        <View style={Style.Legends}>
          {legends.map((legend, i) => (
            <View key={i} style={Style.LegendItem}>
              <Text
                text={legend.title}
                style={Style.LegendItemTitle}
              />
              <Text
                text={legend.subtitle}
                prepend={(
                  <StatisticsChartLegend
                    type={legend.type}
                    color={Style.Bar.backgroundColor}
                    style={Style.Legend}
                  />
                )}
                style={Style.LegendItemSubtitle}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

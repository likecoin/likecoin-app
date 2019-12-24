import React, {
  useCallback,
  useEffect,
  useMemo,
} from "react"
import {
  Image,
  ImageStyle,
  Text as ReactNativeText,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { ContentListItemProps } from "./content-list-item.props"

import { Text } from "../text"
import { sizes } from "../text/text.sizes"
import { spacing } from "../../theme"

const ROOT: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
  flexDirection: "row",
  alignItems: "center",
}
const DETAIL_VIEW: ViewStyle = {
  flex: 1,
}
const DETAIL_TEXT: TextStyle = {
  marginTop: spacing[1],
  lineHeight: sizes.medium * 1.5,
}
const IMAGE_VIEW: ImageStyle = {
  flex: 0,
  width: 64,
  marginLeft: spacing[4],
  aspectRatio: 1,
  resizeMode: "cover",
}

export function ContentListItem(props: ContentListItemProps) {
  const {
    creatorName,
    hasFetchedDetails,
    likeCount,
    likerCount,
    onFetchStat,
    onFetchDetails,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPress,
    style,
    thumbnailURL,
    title,
    url,
    ...rest
  } = props

  useEffect(() => {
    if (!hasFetchedDetails) {
      if (onFetchDetails) onFetchDetails(url)
    }
    if (onFetchStat) onFetchStat(url)
  }, [hasFetchedDetails, url])

  const onPressCallback = useCallback(() => {
    if (onPress) onPress(url)
  }, [url])

  const likeStatText = useMemo(() => {
    if (likeCount === 0) return null
    let text = `${likeCount} LIKE`
    if (likerCount > 0) {
      text = `${text} from ${likerCount} liker${likerCount > 1 ? "s" : ""}`
    }
    text = ` | ${text}`
    return text
  }, [likeCount, likerCount])

  const rootStyle = {
    ...ROOT,
    ...style,
  }

  return (
    <TouchableOpacity
      onPress={onPressCallback}
      style={rootStyle}
      {...rest}
    >
      <View style={DETAIL_VIEW}>
        <Text
          color="likeGreen"
          size="default"
          weight="600"
          text={creatorName}
        />
        <ReactNativeText style={DETAIL_TEXT}>
          <Text
            color="grey4a"
            size="medium"
            weight="600"
            text={title}
          />
          <Text
            text={likeStatText}
            color="grey9b"
          />
        </ReactNativeText>
      </View>
      {!!thumbnailURL &&
        <Image
          source={{ uri: thumbnailURL }}
          style={IMAGE_VIEW}
        />
      }
    </TouchableOpacity>
  )
}

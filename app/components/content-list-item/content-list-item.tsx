import React, {
  useCallback,
  useEffect,
  useMemo,
} from "react"
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native"

import { ContentListItemProps } from "./content-list-item.props"
import Style from "./content-list-item.styles"

import { Icon } from "../icon"
import { Text } from "../text"
import { translate } from "../../i18n"

export function ContentListItem(props: ContentListItemProps) {
  const {
    creatorName,
    hasFetchedDetails,
    likeCount,
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

  const likeStatText = useMemo(
    () => translate("ContentListItem.likeStatsLabel", { count: likeCount }),
    [likeCount]
  )

  const rootStyle = {
    ...Style.ROOT,
    ...style,
  }

  return (
    <TouchableOpacity
      onPress={onPressCallback}
      style={rootStyle}
      {...rest}
    >
      <View style={Style.ROW}>
        <View style={Style.DETAIL_VIEW}>
          <Text
            color="likeGreen"
            size="default"
            weight="600"
            text={creatorName}
          />
          <Text
            color="grey4a"
            size="medium"
            weight="600"
            text={title}
            style={Style.DETAIL_TEXT}
          />
        </View>
        {!!thumbnailURL &&
          <Image
            source={{ uri: thumbnailURL }}
            style={Style.IMAGE_VIEW}
          />
        }
      </View>
      {likeCount > 0 &&
        <View style={Style.ROW}>
          <Text
            text={likeStatText}
            size="medium"
            prepend={(
              <Icon
                name="like-clap"
                width={24}
                color="grey9b"
              />
            )}
            color="grey9b"
          />
        </View>
      }
    </TouchableOpacity>
  )
}

import * as React from "react"
import { Image, StyleSheet } from "react-native"
import styled from "styled-components/native"

import { color } from "../../theme"

import { Icon } from "../icon"

const View = styled.View`
  justify-content: center;
  align-items: center;
  min-height: 100px;
  aspect-ratio: 1.91;
  background-color: ${({ theme }) => theme.color.background.image.placeholder};
`

interface ContentListItemCoverImageProps {
  url?: string
}

export function ContentListItemCoverImage({
  url,
  ...props
}: ContentListItemCoverImageProps) {
  return (
    <View {...props}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Icon
          name="like-clap"
          width={48}
          height={48}
          color={color.palette.grey9b}
        />
      )}
    </View>
  )
}

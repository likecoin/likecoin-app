import * as React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Button } from "../button"
import { IconTypes } from "../icon"
import { Text } from "../text"

const items: { id: IconTypes, url: string }[] = [
  {
    id: "twitter",
    url: "https://twitter.com/likecoin",
  },
  {
    id: "discord",
    url: "https://discord.gg/W4DQ6peZZZ",
  },
  {
    id: "medium",
    url: "https://medium.com/likecoin",
  },
  {
    id: "github",
    url: "https://github.com/likecoin",
  },
]

const Label = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.text.size.md};
  font-weight: 600;
  text-align: center;
`

const LinkList = styled.View`
  justify-content: center;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const LinkItem = styled(Button)`
  min-width: 28px;
  min-height: 28px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: 14px;
  background-color: ${({ theme }) => theme.color.text.secondary};
`

interface CommunityLinksProps {}

export function CommunityLinks(props: CommunityLinksProps) {
  return (
    <View {...props}>
      <Label tx="community_links_label" />
      <LinkList>
        {items.map(({ id, url }) => (
          <LinkItem
            key={id}
            icon={id}
            color="white"
            size="small"
            link={url}
          />
        ))}
      </LinkList>
    </View>
  )
}

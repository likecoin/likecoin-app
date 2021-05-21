import * as React from "react"
import styled from "styled-components/native"

import { translate } from "../../i18n"
import { getPriceEmoji } from "../../utils/civic-liker"

import { Avatar } from "../avatar"
import {
  TableViewCell as UnstyledTableViewCell,
  TableViewCellProps,
} from "../table-view/table-view-cell"

export interface PureSupporterListItemProps extends TableViewCellProps {
  avatarURL?: string
  displayName?: string
  quantity?: number
}

const TableViewCell = styled(UnstyledTableViewCell)`
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`

/**
 * Stateless Supporter List Item
 */
export function PureSupporterListItem(props: PureSupporterListItemProps) {
  const { avatarURL, displayName, quantity, ...restProps } = props
  const amount = quantity * 5
  const emoji = getPriceEmoji(amount)
  const subtitle = `${emoji} ${amount} ${translate("supporter_list_quantity_unit")}`
  return (
    <TableViewCell
      append={(
        <Avatar
          src={avatarURL}
          isCivicLiker={true}
          size={32}
        />
      )}
      title={displayName}
      subtitle={subtitle}
      {...restProps}
    />
  )
}

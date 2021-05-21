import * as React from "react"
import { observer } from "mobx-react"

import { Supporter } from "../../models/supporter"

import { TableViewCellProps } from "../table-view/table-view-cell"

import { PureSupporterListItem } from "./supporter-list-item.pure"

export interface SupporterListItemProps extends TableViewCellProps {
  item: Supporter
}

@observer
export class SupporterListItem extends React.Component<SupporterListItemProps> {
  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate() {
    this.fetch()
  }

  private fetch = async () => {
    if (this.props.item.status === "done") return
    await this.props.item.fetchDetails()
  }

  render() {
    const { item, ...props } = this.props
    return (
      <PureSupporterListItem
        avatarURL={item.avatarURL}
        displayName={item.normalizedName}
        quantity={item.quantity}
        {...props}
      />
    )
  }
}
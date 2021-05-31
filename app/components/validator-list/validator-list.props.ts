import { ScrollViewProps } from "react-native"

import { ChainStore } from "../../models/chain-store"
import { Validator } from "../../models/validator"

export type ValidatorListFilter = "all" | "active" | "inactive"

export interface ValidatorListProps extends ScrollViewProps {
  /**
   * Filter out specific validators
   */
  filter: ValidatorListFilter

  /**
   * The Cosmos chain store
   */
  chain: ChainStore

  /**
   * The validator addresses that exclude from the list
   */
  excluded?: string[]

  /**
   * Limit the number of validators shown. Default is 0, which shows all.
   */
  limit: number

  /**
   * Wrap with scroll view
   */
  isScrolling: boolean

  /**
   * Callback when a list item is pressed
   */
  onPressItem?: (validator: Validator) => void
}

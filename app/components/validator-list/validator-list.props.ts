import { ViewStyle } from "react-native"
import { ChainStore } from "../../models/chain-store"

import { Validator } from "../../models/validator"

export interface ValidatorListProps {
  /**
   * The Cosmos chain store
   */
  chain: ChainStore

  /**
   * The validator addresses that exclude from the list
   */
  excluded?: string[]

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * Callback when a list item is pressed
   */
  onPressItem?: (validator: Validator) => void
}

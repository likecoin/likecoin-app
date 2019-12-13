import { ReactElement, ReactNode } from "react"
import { ViewStyle } from "react-native"

export type SigningViewType = "transfer" | "stake" | "unstake" | "reward"
export type SigningViewStateType = "waiting" | "pending" | "success"

export interface SigningViewProps {
  /**
   * The type of the signing view
   */
  type: SigningViewType

  /**
   * The state of the transaction
   */
  state: SigningViewStateType

  /**
   * The title text which look up from i18n
   */
  titleTx?: string

  /**
   * The amount of the transaction
   */
  amount: string

  /**
   * The fee of the transaction
   */
  fee?: string

  /**
   * The total amount of the transaction
   */
  totalAmount?: string

  /**
   * The text of the error message label
   */
  error?: string

  /**
   * The target of the transaction
   */
  target?: string,

  /**
   * The URL to the block explorer
   */
  txURL?: string

  /**
   * The graph for identity on the top right corner
   */
  graph?: ReactElement

  /**
   * The style of the graph
   */
  graphStyle?: ViewStyle

  /**
   * The children append in the bottom navigation
   */
  bottomNavigationAppendChildren?: ReactNode

  /**
   * Callback of clicking close button
   */
  onClose?: () => void

  /**
   * Callback of clicking confirm button
   */
  onConfirm?: () => void
}

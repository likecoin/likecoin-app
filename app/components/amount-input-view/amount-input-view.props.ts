import { ReactElement } from "react"
import BigNumber from "bignumber.js"

export interface AmountInputViewProps {
  /**
   * The input value
   */
  value: string

  /**
   * The amount of the input
   */
  amount: BigNumber

  /**
   * The maximum amount of the input
   */
  maxAmount?: BigNumber

  /**
   * The text of the available label which look up via i18n
   */
  availableLabelTx?: string

  /**
   * The text of the error message label
   */
  error?: string

  /**
   * The text of the confirm button which look up via i18n
   */
  confirmButtonTx?: string

  /**
   * Show a loading indicator inside the done button if set to `true`, default is `false`
   */
  isConfirmButtonLoading?: boolean

  /**
   * The graph for identity on the top right corner
   */
  graph?: ReactElement

  /**
   * Function for formatting the amount
   */
  formatAmount?: (amount: BigNumber) => string

  /**
   * Callback for changing amount
   */
  onChange?: (amount: string) => void

  /**
   * Callback of clicking close button
   */
  onClose?: () => void

  /**
   * Callback of clicking confirm button
   */
  onConfirm?: () => void

  /**
   * Callback of clicking confirm button if amount is exceeded the maximum
   */
  onErrorExceedMax?: () => void

  /**
   * Callback of clicking confirm button if amount is less than 0
   */
  onErrorLessThanZero?: () => void
}

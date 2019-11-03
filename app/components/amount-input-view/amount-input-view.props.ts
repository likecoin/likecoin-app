import { ReactElement } from "react"

export interface AmountInputViewProps {
  /**
   * The amount of the input
   */
  amount: string

  /**
   * The maximum amount of the input
   */
  maxAmount?: string

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

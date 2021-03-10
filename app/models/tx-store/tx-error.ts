export class TxError extends Error {};

export class TxInsufficientGasFeeError extends TxError {
  diff: string

  constructor(diff: string) {
    super('TX_INSUFFICIENT_GAS_FEE')
    this.diff = diff
  }
}

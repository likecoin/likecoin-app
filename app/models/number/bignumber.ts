import BigNumber from "bignumber.js"
import { types } from "mobx-state-tree"

export const BigNumberPrimitive = types.custom<string, BigNumber>({
  name: "BigNumber",
  fromSnapshot(value: string) {
    return new BigNumber(value)
  },
  toSnapshot(value: BigNumber) {
    return value.toString()
  },
  isTargetType(value: string | BigNumber): boolean {
    return value instanceof BigNumber
  },
  getValidationMessage(value: string): string {
    if (new BigNumber(value).isNaN()) {
      return `'${value}' doesn't look like a valid big number`
    }
    return ""
  },
})

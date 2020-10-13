import moment, { MomentInput } from "moment"

/**
 * Adds date utility functions to the node
 */
export const withDateUtils = () => {
  /**
   * Get the noon date of the input date
   * @param inputDate Moment
   * @returns The noon date of the input date 
   */
  function getDateNoon(inputDate: MomentInput) {
    return moment(inputDate)
      .startOf("day")
      .add(12, "hours")
  }

  /**
   * Calculate whether the input date is within the target date from 00:00 to 23:59
   * @param inputDate The date to compare with
   * @param targetDate The date of the compare range
   */
  function getIsWithinTheDay(inputDate: MomentInput, targetDate: MomentInput) {
    const date = moment(inputDate)
    const target = moment(targetDate)
    return (
      date.isSameOrAfter(target.startOf("day")) &&
      date.isSameOrBefore(target.endOf("day"))
    )
  }

  return {
    views: {
      /**
       * Convert date to unix timestamp in milliseconds
       * @param inputDate The input date
       * @returns Milliseconds
       */
      getDateInMs(inputDate: MomentInput) {
        return moment(inputDate).valueOf()
      },
      getDateNoon,
      getIsWithinTheDay,
      /**
       * Check whether the input date is today
       * @param inputDate 
       */
      getIsToday(inputDate: MomentInput) {
        return getIsWithinTheDay(inputDate, moment())
      },
      /**
       * Check whether the input date is yesterday
       * @param inputDate 
       */
      getIsYesterday(inputDate: MomentInput) {
        return getIsWithinTheDay(inputDate, moment().subtract(1, "day"))
      },
      /**
       * Check whether the input date is before the noon of the input date
       * @param inputDate 
       */
      getIsBeforeNoon(inputDate: MomentInput) {
        const date = moment(inputDate)
        return date.isBefore(getDateNoon(date))
      },
      /**
       * Check whether the input date is on or after the noon of the input date
       * @param inputDate 
       */
      getIsAfternoon(inputDate: MomentInput) {
        const date = moment(inputDate)
        return date.isSameOrAfter(getDateNoon(date))
      },
    },
  }
}

export const getNormalizedTemperature = (num: number) => {
  const adjustNum = 5 * (num - parseInt("80", 16))
  return adjustNum >= 400 ? 400 : adjustNum <= 0 ? 0 : adjustNum
}

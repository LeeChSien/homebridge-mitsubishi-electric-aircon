import { getNormalizedTemperature } from '../utils/normalize.js'
import { SensorStates } from '../types.js'

export const isSensorStatesPayload = (payload: string) => {
  return ['62', '7b'].includes(payload.substring(2, 4)) && payload.substring(10, 12) === '03'
}

export const parseSensorStates = (payload: string): SensorStates => {
  const t = parseInt(payload.substring(20, 22), 16)
  const outsideTemperature = t < 16 ? undefined : getNormalizedTemperature(t)
  const roomTemperature = getNormalizedTemperature(parseInt(payload.substring(24, 26), 16))
  const thermalSensor = (parseInt(payload.substring(38, 40), 16) & parseInt('01', 16)) !== 0
  const windSpeedPr557 = (parseInt(payload.substring(40, 42), 16) & parseInt('01', 16)) === 1 ? 1 : 0

  return {
    outsideTemperature,
    roomTemperature,
    thermalSensor,
    windSpeedPr557,
  }
}

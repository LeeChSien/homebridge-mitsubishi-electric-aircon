import { getNormalizedTemperature } from '../utils/normalize.js'
import { GeneralStates, POWER_ON_OFF, WIND_SPEED, DRIVE_MODE, HORIZONTAL_WIND_DIRECTION, VERTICAL_WIND_DIRECTION } from '../types.js'
const getOnOffStatus = (segment: string): POWER_ON_OFF => {
  switch (segment) {
    case '01':
    case '02':
      return POWER_ON_OFF.ON
    default:
      return POWER_ON_OFF.OFF
  }
}

const getDriveMode = (segment: string): DRIVE_MODE => {
  switch (segment) {
    case '03':
    case '0b':
      return DRIVE_MODE.COOLER
    case '01':
    case '09':
      return DRIVE_MODE.HEATER
    case '08':
      return DRIVE_MODE.AUTO;
    case '00':
    case '02':
    case '0a':
    case '0c':
      return DRIVE_MODE.DEHUM;
    case "1b":
      return DRIVE_MODE.AUTO_COOLER;
    case "19":
      return DRIVE_MODE.AUTO_HEATER;
    default:
      return DRIVE_MODE.FAN;
  }
}

const getWindSpeed = (segment: string): WIND_SPEED => {
  switch (segment) {
    case '00':
      return WIND_SPEED.AUTO
    case '01':
      return WIND_SPEED.LEVEL_1
    case '02':
      return WIND_SPEED.LEVEL_2
    case '03':
      return WIND_SPEED.LEVEL_3
    case '05':
      return WIND_SPEED.LEVEL_FULL
    default:
      return WIND_SPEED.AUTO
  }
}

const getHorizontalWindDirection = (segment: string): HORIZONTAL_WIND_DIRECTION => {
  return 127 & parseInt(segment, 16) as HORIZONTAL_WIND_DIRECTION
}

const getVerticalWindDirection = (segment: string): VERTICAL_WIND_DIRECTION => {
  switch (segment) {
    case '00':
      return VERTICAL_WIND_DIRECTION.AUTO
    case '01':
      return VERTICAL_WIND_DIRECTION.V1
    case '02':
      return VERTICAL_WIND_DIRECTION.V2
    case '03':
      return VERTICAL_WIND_DIRECTION.V3
    case '04':
      return VERTICAL_WIND_DIRECTION.V4
    case '05':
      return VERTICAL_WIND_DIRECTION.V5
    case '07':
      return VERTICAL_WIND_DIRECTION.SWING
    default:
      return VERTICAL_WIND_DIRECTION.AUTO
  }
}

export const isGeneralStatesPayload = (payload: string) => {
  return ['62', '7b'].includes(payload.substring(2, 4)) && payload.substring(10, 12) === '02'
}

export const parseGeneralStates = (payload: string): GeneralStates => {
  const powerOnOff = getOnOffStatus(payload.substring(16, 18))
  const temperature = getNormalizedTemperature(parseInt(payload.substring(32, 34), 16))
  const driveMode = getDriveMode(payload.substring(18, 20))
  const windSpeed = getWindSpeed(payload.substring(22, 24))
  const rightVerticalWindDirection = getVerticalWindDirection(payload.substring(24, 26))
  const leftVerticaWindDirection = getVerticalWindDirection(payload.substring(40, 42))
  const horizontalWindDirection = getHorizontalWindDirection(payload.substring(30, 32))
  // extra states
  const dehumSetting = parseInt(payload.substring(34, 36), 16)
  const isPowerSaving = parseInt(payload.substring(36, 38), 16) > 0
  const windAndWindBreakDirect = parseInt(payload.substring(38, 40), 16)

  return {
    powerOnOff,
    temperature,
    driveMode,
    windSpeed,
    verticalWindDirection: {
      right: rightVerticalWindDirection,
      left: leftVerticaWindDirection
    },
    horizontalWindDirection,
    dehumSetting,
    isPowerSaving,
    windAndWindBreakDirect
  }
}
export interface GeneralStates {
  powerOnOff: POWER_ON_OFF;
  temperature: number;
  driveMode: DRIVE_MODE;
  windSpeed: WIND_SPEED;
  verticalWindDirection: {
    right: VERTICAL_WIND_DIRECTION
    left: VERTICAL_WIND_DIRECTION
  },
  horizontalWindDirection: HORIZONTAL_WIND_DIRECTION
  // extra states
  dehumSetting: number
  isPowerSaving: boolean
  windAndWindBreakDirect: number
}

export interface SensorStates {
  outsideTemperature: number | undefined
  roomTemperature: number
  thermalSensor: boolean
  windSpeedPr557: 0 | 1
}

export interface ErrorStates {
  isAbnormalState: boolean
  errorCode: string
}

export type MEAirconStates = GeneralStates & SensorStates & ErrorStates

export interface GeneralControls {
  // segment1
  powerOnOff?: boolean,
  temperature?: boolean,
  windSpeed?: boolean,
  driveMode?: boolean,
  upDownWindDirect?: boolean,
  // segment2
  leftRightWindDirect?: boolean
  outsideControl?: boolean
}

export enum POWER_ON_OFF {
  OFF = '00',
  ON = '01'
}

export enum DRIVE_MODE {
  HEATER = '01',
  DEHUM = '02',
  COOLER = '03',
  AUTO = '08',
  AUTO_COOLER = '1b',
  AUTO_HEATER = '19',
  FAN = '07'
}

export enum WIND_SPEED {
  AUTO = 0,
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_FULL = 5
}

export enum VERTICAL_WIND_DIRECTION {
  AUTO = 0, // Auto
  V1 = 1,
  V2 = 2,
  V3 = 3,
  V4 = 4,
  V5 = 5,
  SWING = 7 // Swing
}

export enum HORIZONTAL_WIND_DIRECTION {
  AUTO = 0, // Auto
  L = 1,
  LS = 2, // Ls
  C = 3,
  RS = 4, // Rs
  R = 5,
  LC = 6,
  CR = 7,
  LR = 8,
  LCR = 9,
  LCR_S = 12
}

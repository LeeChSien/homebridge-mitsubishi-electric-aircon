import { extend08Command } from './extend08.js'
import { POWER_ON_OFF, WIND_SPEED, DRIVE_MODE, HORIZONTAL_WIND_DIRECTION, VERTICAL_WIND_DIRECTION } from '../types.js'

const EXAMPLE_STATES = {
  powerOnOff: POWER_ON_OFF.ON,
  temperature: 260,
  driveMode: DRIVE_MODE.COOLER,
  windSpeed: WIND_SPEED.AUTO,
  verticalWindDirection: {
    right: VERTICAL_WIND_DIRECTION.AUTO,
    left: VERTICAL_WIND_DIRECTION.AUTO,
  },
  horizontalWindDirection: HORIZONTAL_WIND_DIRECTION.AUTO,
  dehumSetting: 60,
  isPowerSaving: false,
  windAndWindBreakDirect: 2,
} 

describe('commands > general', () => {
  it('generalCommand', () => {
    // should trigger buzz
    expect(extend08Command(EXAMPLE_STATES, { buzzer: true })).toBe('fc410130100810000000000001000000000000000065')
  })
})

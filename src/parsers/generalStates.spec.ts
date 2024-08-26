import { isGeneralStatesPayload, parseGeneralStates } from './generalStates.js'
import { POWER_ON_OFF, WIND_SPEED, DRIVE_MODE, HORIZONTAL_WIND_DIRECTION, VERTICAL_WIND_DIRECTION } from '../types.js'

const EXAMPLE_PAYLOAD = 'fc62013010020000010b070000000080b03c000200da'

describe('parsers > generalStates', () => {
  it('isGeneralStatesPayload', () => {
    expect(isGeneralStatesPayload(EXAMPLE_PAYLOAD)).toBe(true)
  })

  it('parseGeneralStates', () => {
    expect(parseGeneralStates(EXAMPLE_PAYLOAD)).toStrictEqual({
      powerOnOff: POWER_ON_OFF.ON,
      temperature: 240,
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
    })
  })
})
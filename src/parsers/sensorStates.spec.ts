import { isSensorStatesPayload, parseSensorStates } from './sensorStates.js'

const EXAMPLE_PAYLOAD = 'fc620130100300000e00c2b1b1fe420005a912000028'

describe('parsers > sensorStates', () => {
  it('isSensorStatesPayload', () => {
    expect(isSensorStatesPayload(EXAMPLE_PAYLOAD)).toBe(true)
  })

  it('parseSensorStates', () => {
    expect(parseSensorStates(EXAMPLE_PAYLOAD)).toStrictEqual({
      outsideTemperature: 330,
      roomTemperature: 245,
      thermalSensor: false,
      windSpeedPr557: 0
    })
  })
})

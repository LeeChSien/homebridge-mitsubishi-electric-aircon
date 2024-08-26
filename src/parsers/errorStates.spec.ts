import { isErrorStatesPayload, parseErrorStates } from './errorStates.js'

const EXAMPLE_PAYLOAD = 'fc6201301004000000800000000000000000000000d9'

describe('parsers > errorStates', () => {
  it('isSensorStatesPayload', () => {
    expect(isErrorStatesPayload(EXAMPLE_PAYLOAD)).toBe(true)
  })

  it('parseErrorStates', () => {
    expect(parseErrorStates(EXAMPLE_PAYLOAD)).toStrictEqual({
      isAbnormalState: false,
      errorCode: '8000',
    })
  })
})

import { GeneralStates, GeneralControls } from '../types.js'
import { calcFCC } from '../utils/calcFCC.js'

const MIN_TEMPERATURE = 160
const MAX_TEMPERATURE = 310

const convertTemperature = (temperature: number) => {
  const t = Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPERATURE, temperature));
  const e = (31 - Math.floor(t / 10)).toString(16);
  return (t.toString().substr(-1, 1) === '0' ? '0' : '1') + e
}

const convertTemperatureToSegement = (temperature: number) => {
  return (parseInt('80', 16) + temperature / 5).toString(16)
}

const generateDecodeValue = (segments: Record<string, string>) => {
  let payload = '41013010'
  new Array(16).fill(0).map(((_t, e) => (e))).forEach(((n) => {
    payload += segments['segment' + n] || '00'
  }))
  const n = calcFCC(payload);
  return "fc" + payload + n
}

export const generalCommand = (states: Omit<GeneralStates, 'dehumSetting' | 'isPowerSaving' | 'windAndWindBreakDirect'>, controls: GeneralControls) => {
  const segments = {
    segment0: '01',
    segment1: '00',
    segment2: '00',
    segment3: '00',
    segment4: '00',
    segment5: '00',
    segment6: '00',
    segment7: '00',
    segment13: '00',
    segment14: '00',
    segment15: '00'
  }

  let segment1Value = 0
  let segment2Value = 0

  // calculate segment 1 value
  controls.powerOnOff && (segment1Value |= parseInt('01', 16))
  controls.driveMode && (segment1Value |= parseInt('02', 16))
  controls.temperature && (segment1Value |= parseInt('04', 16))
  controls.windSpeed && (segment1Value |= parseInt('08', 16))
  controls.upDownWindDirect && (segment1Value |= parseInt('10', 16))
  // calculate segment 2 value
  controls.leftRightWindDirect && (segment2Value |= parseInt('01', 16));
  (controls.outsideControl !== false) && (segment2Value |= parseInt('02', 16)) // turn on outsideControl in default

  segments.segment1 = ('00' + segment1Value.toString(16)).slice(-2)
  segments.segment2 = ('00' + segment2Value.toString(16)).slice(-2)
  segments.segment3 = states.powerOnOff
  segments.segment4 = states.driveMode
  segments.segment6 = ('00' + states.windSpeed.toString(16)).slice(-2)
  segments.segment7 = ('00' + states.verticalWindDirection.right.toString(16)).slice(-2)
  segments.segment13 = ('00' + states.horizontalWindDirection.toString(16)).slice(-2)
  segments.segment15 = '41' // checkInside: 41 true, 42 false

  segments.segment5 = convertTemperature(states.temperature)
  segments.segment14 = convertTemperatureToSegement(states.temperature)

  return generateDecodeValue(segments)
}
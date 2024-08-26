/* eslint-disable @typescript-eslint/no-unused-expressions */
import { MEAirconStates } from '../types.js'
import { calcFCC } from '../utils/calcFCC.js'

interface Extend08Controls {
  dehum?: boolean
  powerSaving?: boolean
  buzzer?: boolean
  windAndWindBreak?: boolean
}

export const extend08Command = (states: Pick<MEAirconStates, 'dehumSetting' | 'isPowerSaving' | 'windAndWindBreakDirect'>, controls: Extend08Controls) => {
  let segmentXValue = 0;
  controls.dehum && (segmentXValue |= parseInt('04', 16))
  controls.powerSaving && (segmentXValue |= parseInt('08', 16))
  controls.buzzer && (segmentXValue |= parseInt('10', 16))
  controls.windAndWindBreak && (segmentXValue |= parseInt('20', 16))

  const segmentX = ('00' + segmentXValue.toString(16)).slice(-2)
  let segmentY = '00'
  controls.dehum && (segmentY = ('00' + states.dehumSetting.toString(16)).slice(-2))

  const segmentZ = states.isPowerSaving ? '0A' : '00' // be aware of it, we removed some checking logic for power saving

  let segmentA = '00';
  controls.windAndWindBreak && (segmentA = ('00' + states.windAndWindBreakDirect).slice(-2))

  const payload = "4101301008" + segmentX + "0000" + segmentY + segmentZ + segmentA + (controls.buzzer ? "01" : "00") + "0000000000000000";
  return 'fc' + payload + calcFCC(payload)
}

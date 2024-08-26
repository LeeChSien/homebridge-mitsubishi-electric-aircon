import { ErrorStates } from '../types.js'

export const isErrorStatesPayload = (payload: string) => {
  return ['62', '7b'].includes(payload.substring(2, 4)) && payload.substring(10, 12) === '04'
}

export const parseErrorStates = (payload: string): ErrorStates => {
  const codeHead = payload.substring(18, 20), codeTail = payload.substring(20, 22)
  const isAbnormalState = !(codeHead === '80' && codeTail === '00')
  const errorCode = `${codeHead}${codeTail}`

  return {
    isAbnormalState,
    errorCode,
  }
}

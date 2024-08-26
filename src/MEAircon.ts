import { Curl } from 'node-libcurl';
import xml2js from 'xml2js'
import { DRIVE_MODE, MEAirconStates, POWER_ON_OFF } from './types.js'
import { encrypt, decrypt } from './utils/crypt.js'
import { isGeneralStatesPayload, parseGeneralStates } from './parsers/generalStates.js'
import { isSensorStatesPayload, parseSensorStates } from './parsers/sensorStates.js'
import { isErrorStatesPayload, parseErrorStates } from './parsers/errorStates.js'
import { extend08Command } from './commands/extend08.js';
import { generalCommand } from './commands/general.js';

interface MEAirconIdentify {
  mac: string
  serial: string
  rssi: string
  appVersion: string
}

const REQUEST_TEMPLATE = {
  CONNECT: 'ON'
}

const parseIdentity = async (response: string): Promise<MEAirconIdentify> => {
  const xmlParser = new xml2js.Parser();
  const responseContainer = await xmlParser.parseStringPromise(response)
  const responseContent = await xmlParser.parseStringPromise(decrypt(responseContainer.ESV))
  const { MAC, SERIAL, RSSI, APP_VER } = responseContent.LSV
  return {
    mac: MAC,
    serial: SERIAL,
    rssi: RSSI,
    appVersion: APP_VER
  } as MEAirconIdentify
}

const parseStates = async (response: string): Promise<MEAirconStates> => {
  const xmlParser = new xml2js.Parser();
  const responseContainer = await xmlParser.parseStringPromise(response)
  const responseContent = await xmlParser.parseStringPromise(decrypt(responseContainer.ESV))
  const payloads = responseContent.LSV.CODE[0].VALUE as Array<string>
  let newStates: Partial<MEAirconStates> = {}
  payloads.forEach((payload) => {
    if (isGeneralStatesPayload(payload)) {
      newStates = {
        ...newStates,
        ...parseGeneralStates(payload)
      }
    }

    if (isSensorStatesPayload(payload)) {
      newStates = {
        ...newStates,
        ...parseSensorStates(payload)
      }
    }

    if (isErrorStatesPayload(payload)) {
      newStates = {
        ...newStates,
        ...parseErrorStates(payload)
      }
    }
  })
  return newStates as MEAirconStates
}

const getBuzzPayload = (states: MEAirconStates) => {
  return extend08Command(states, { buzzer: true })
}

export interface MEAirconConfig {
  name: string
  ip: string
  model?: string
}

/** 
 * Mitsubishi Electric Remote Controller
 * Reverse-engineered the signal from MSZ-ZW5620S-W
 */
export default class MEAircon {
  identity = {} as MEAirconIdentify
  states = {} as MEAirconStates

  postRequest: (content: object) => Promise<string>

  constructor(public readonly configs: MEAirconConfig) {
    // bind curl requester
    this.postRequest = (content: object) => {
      const xmlBuilder = new xml2js.Builder({ rootName: 'CSV', headless: true });
      return new Promise<string>((resolve, reject) => {
        const API_ENDPOINT = `http://${configs.ip}/smart`
        const curl = new Curl();
        curl.setOpt('URL', API_ENDPOINT);
        curl.setOpt(Curl.option.POST, true)
        curl.setOpt(Curl.option.POSTFIELDS, `<?xml version="1.0" encoding="UTF-8"?><ESV>${encrypt(xmlBuilder.buildObject(content))}</ESV>`)
        curl.setOpt(Curl.option.HTTPHEADER, [
          `Host: ${configs.ip}:80`,
          'Content-Type: text/plain;chrset=UTF-8',
          'Connection: keep-alive',
          'Proxy-Connection: keep-alive',
          'Accept: */*',
          'User-Agent: KirigamineRemote/5.1.0 (jp.co.MitsubishiElectric.KirigamineRemote; build:3; iOS 17.5.1) Alamofire/5.9.1',
          'Accept-Language: zh-Hant-JP;q=1.0, ja-JP;q=0.9'
        ])
        curl.on('end', (_statusCode: string, data: string) => {
          resolve(data)
        });
        curl.on('error', reject);
        curl.perform();
      })
    }
  }

  async fetchStates() {
    const response = await this.postRequest(REQUEST_TEMPLATE)
    this.states = {
      ...this.states,
      ...await parseStates(response)
    }
    this.identity = {
      ...this.identity,
      ...await parseIdentity(response)
    }
  }

  getAttribute(attrName: keyof MEAirconStates): any {
    switch (attrName) {
      case 'powerOnOff':
        return this.states.powerOnOff === POWER_ON_OFF.ON ? true : false
      case 'driveMode':
        return this.states.driveMode
      case 'temperature':
        return this.states.temperature / 10
      case 'roomTemperature':
        return this.states.roomTemperature / 10
      default:
        return
    }
  }

  getAttributesFun(attrName: keyof MEAirconStates) {
    return () => {
      return this.getAttribute(attrName)
    }
  }

  async setPowerOnOff(power: boolean) {
    this.states = {
      ...this.states,
      powerOnOff: power ? POWER_ON_OFF.ON : POWER_ON_OFF.OFF
    }
    const response = await this.postRequest({
      ...REQUEST_TEMPLATE,
      CODE: {
        VALUE: [
          getBuzzPayload(this.states),
          generalCommand(this.states, { powerOnOff: true })
        ]
      }
    })
    console.log(await parseStates(response))
  }

  async setDriveMode(driveMode: DRIVE_MODE) {
    this.states = {
      ...this.states,
      driveMode
    }
    const response = await this.postRequest({
      ...REQUEST_TEMPLATE,
      CODE: {
        VALUE: [
          getBuzzPayload(this.states),
          generalCommand(this.states, { driveMode: true })
        ]
      }
    })
    console.log(await parseStates(response))
  }

  async setTemerature(temperature: number) {
    this.states = {
      ...this.states,
      temperature: temperature * 10
    }
    const response = await this.postRequest({
      ...REQUEST_TEMPLATE,
      CODE: {
        VALUE: [
          getBuzzPayload(this.states),
          generalCommand(this.states, { temperature: true })
        ]
      }
    })
    console.log(await parseStates(response))
  }
}
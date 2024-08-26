import type { PlatformAccessory, Service } from 'homebridge'

import type { MEAirconPlatform } from './MEAirconPlatform.js'
import MEAircon, { MEAirconConfig } from './MEAircon.js'
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js'
import intervalPromise from 'interval-promise'
import { DRIVE_MODE } from './types.js'

export class MEAirconPlatformAccessory extends MEAircon {
  public accessory!: PlatformAccessory
  private service!: Service;
  private updateInterval!: ReturnType<typeof intervalPromise>

  constructor(
    private readonly platform: MEAirconPlatform,
    public readonly configs: MEAirconConfig,
  ) {
    super(configs)
  }

  async init() {
    await this.fetchStates()

    const uuid = this.platform.api.hap.uuid.generate(this.identity.serial || `IP_${this.configs.ip}`);

    const existingAccessory = this.platform.accessories.find(accessory => accessory.UUID === uuid)
    if (existingAccessory) {
      this.accessory = existingAccessory
    } else {
      this.accessory = new this.platform.api.platformAccessory(this.configs.name || 'AC', uuid);
      this.accessory.context.device = this.configs;
      this.platform.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.accessory])
    }

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Mitsubishi Electric')
      .setCharacteristic(this.platform.Characteristic.Model, this.configs.model || 'AC')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, this.identity.serial)

    this.service = this.accessory.getService(this.platform.Service.HeaterCooler) || this.accessory.addService(this.platform.Service.HeaterCooler)

    this.service.setCharacteristic(this.platform.Characteristic.Name, this.configs.name || 'AC')

    this.updateInterval = intervalPromise(async () => {
      await this.fetchStates()
      this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
        .updateValue(this.getAttribute('roomTemperature'))
    }, 60 * 1000)

    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(async (value) => {
        await this.setPowerOnOff(!!value)
      })
      .onGet(this.getAttributesFun('powerOnOff'))

    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeaterCoolerState)
      .onGet(() => {
        if (!this.getAttribute('powerOnOff')) {
          return this.platform.Characteristic.CurrentHeaterCoolerState.INACTIVE
        }

        const driveMode = this.getAttribute('driveMode')

        if (driveMode === DRIVE_MODE.AUTO_COOLER || driveMode === DRIVE_MODE.COOLER || driveMode === DRIVE_MODE.DEHUM) {
          if (this.getAttribute('roomTemperature') <= this.getAttribute('temperature')) {
            return this.platform.Characteristic.CurrentHeaterCoolerState.IDLE
          } else {
            return this.platform.Characteristic.CurrentHeaterCoolerState.COOLING
          }
        }

        if (driveMode === DRIVE_MODE.AUTO_HEATER || driveMode === DRIVE_MODE.HEATER) {
          if (this.getAttribute('roomTemperature') >= this.getAttribute('temperature')) {
            return this.platform.Characteristic.CurrentHeaterCoolerState.IDLE
          } else {
            return this.platform.Characteristic.CurrentHeaterCoolerState.HEATING
          }
        }

        if (driveMode === DRIVE_MODE.AUTO) {
          if (this.getAttribute('roomTemperature') >= this.getAttribute('temperature')) {
            return this.platform.Characteristic.CurrentHeaterCoolerState.COOLING
          } else if (this.getAttribute('roomTemperature') <= this.getAttribute('temperature')) {
            return this.platform.Characteristic.CurrentHeaterCoolerState.HEATING
          } else {
            return this.platform.Characteristic.CurrentHeaterCoolerState.IDLE
          }
        }

        return this.platform.Characteristic.CurrentHeaterCoolerState.IDLE
      })

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeaterCoolerState)
      .onSet(async (value) => {
        if (!this.getAttribute('powerOnOff')) {
          return
        } else if (value === this.platform.Characteristic.TargetHeaterCoolerState.COOL) {
          await this.setDriveMode(DRIVE_MODE.COOLER)
        } else if (value === this.platform.Characteristic.TargetHeaterCoolerState.HEAT) {
          await this.setDriveMode(DRIVE_MODE.HEATER)
        } else {
          await this.setDriveMode(DRIVE_MODE.AUTO)
        }
      })
      .onGet(() => {
        const driveMode = this.getAttribute('driveMode')
        if (driveMode === DRIVE_MODE.AUTO_COOLER || driveMode === DRIVE_MODE.COOLER || driveMode === DRIVE_MODE.DEHUM) {
          return this.platform.Characteristic.TargetHeaterCoolerState.COOL
        } else if (driveMode === DRIVE_MODE.AUTO_HEATER || driveMode === DRIVE_MODE.HEATER) {
          return this.platform.Characteristic.TargetHeaterCoolerState.HEAT
        } else {
          return this.platform.Characteristic.TargetHeaterCoolerState.AUTO
        }
      })

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .setProps({ minValue: 0, maxValue: 50, minStep: 0.5 })
      .onGet(this.getAttribute('roomTemperature'))

    this.service.getCharacteristic(this.platform.Characteristic.CoolingThresholdTemperature)
      .setProps({ minValue: 16, maxValue: 31, minStep: 0.5 })
      .onSet(async (value) => {
        await this.setTemerature(Number(value))
      })
      .onGet(this.getAttributesFun('temperature'))

    this.service.getCharacteristic(this.platform.Characteristic.HeatingThresholdTemperature)
      .setProps({ minValue: 16, maxValue: 31, minStep: 0.5 })
      .onSet(async (value) => {
        await this.setTemerature(Number(value))
      })
      .onGet(this.getAttributesFun('temperature'))
  }
}

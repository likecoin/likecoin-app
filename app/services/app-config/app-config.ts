import RemoteConfigModule, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import {
  LIKECO_API_URL,
  LIKERLAND_API_URL,
  AUTHCORE_CREDENTIAL_KEY,
  AUTHCORE_ROOT_URL,
  COSMOS_LCD_URL,
  COSMOS_CHAIN_ID,
  BIG_DIPPER_URL,
} from "react-native-dotenv"

export interface AppConfigParams {
  LIKECO_API_URL: string
  LIKERLAND_API_URL: string
  AUTHCORE_CREDENTIAL_KEY: string
  AUTHCORE_ROOT_URL: string
  COSMOS_LCD_URL: string
  COSMOS_CHAIN_ID: string
  BIG_DIPPER_URL: string
}

export type AppConfigParamKey = keyof AppConfigParams

export class AppConfig {
  /**
   * The config object
   */
  private config: AppConfigParams

  /**
   * The Firebase Remote Config module
   */
  private remoteConfig: FirebaseRemoteConfigTypes.Module

  constructor() {
    this.config = {
      LIKECO_API_URL,
      LIKERLAND_API_URL,
      AUTHCORE_CREDENTIAL_KEY,
      AUTHCORE_ROOT_URL,
      COSMOS_LCD_URL,
      COSMOS_CHAIN_ID,
      BIG_DIPPER_URL,
    }
    this.remoteConfig = RemoteConfigModule()
  }

  async setup() {
    try {
      await this.remoteConfig.setConfigSettings({
        isDeveloperModeEnabled: __DEV__,
      })
      await this.remoteConfig.fetch()
      await this.remoteConfig.activate()
      const { value: newJSONConfig } = this.remoteConfig.getValue('api_config')
      let remoteConfig = {}
      try {
        remoteConfig = JSON.parse(newJSONConfig as string)
      } catch (err) {
        console.error(err)
      }
      this.config = {
        ...this.config,
        ...remoteConfig,
      }
    } catch (err) {
      console.error(err)
    }
  }

  getAllParams() {
    return this.config
  }

  getValue(key: AppConfigParamKey) {
    return this.config[key]
  }
}

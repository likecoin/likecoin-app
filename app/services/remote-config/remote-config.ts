import remoteConfig from '@react-native-firebase/remote-config'
import {
  LIKECO_API_URL,
  LIKERLAND_API_URL,
  AUTHCORE_CREDENTIAL_KEY,
  AUTHCORE_ROOT_URL,
  COSMOS_LCD_URL,
  COSMOS_CHAIN_ID,
  BIG_DIPPER_URL,
} from "react-native-dotenv"

export class RemoteConfig {
  constructor() {
    this.remoteConfig = remoteConfig()
    this.config = {
      LIKECO_API_URL,
      LIKERLAND_API_URL,
      AUTHCORE_CREDENTIAL_KEY,
      AUTHCORE_ROOT_URL,
      COSMOS_LCD_URL,
      COSMOS_CHAIN_ID,
      BIG_DIPPER_URL,
    }
  }

  async setup() {
    try {
      await this.remoteConfig.setConfigSettings({
        isDeveloperModeEnabled: __DEV__,
      })
      await this.remoteConfig.fetch()
      await this.remoteConfig.activate()
      const { value: newJSONConfig } = await this.remoteConfig.getValue('api_config')
      let newConfig = {}
      try {
        newConfig = JSON.parse(newJSONConfig)
      } catch (err) {
        console.error(err)
      }
      this.config = {
        ...this.config,
        ...newConfig,
      }
    } catch (err) {
      console.error(err)
    }
  }

  getConfigObject() {
    return this.config
  }

  getConfigValue(key: string) {
    return this.config[key]
  }
}

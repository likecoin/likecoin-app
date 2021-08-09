import RemoteConfigModule, {
  FirebaseRemoteConfigTypes,
} from "@react-native-firebase/remote-config"
import FastImage from "react-native-fast-image"

import { APP_CONFIG, AppConfigKey } from "./app-config.type"

export class AppConfig {
  /**
   * The config object
   */
  private config: Partial<Record<AppConfigKey, any>>

  /**
   * The Firebase Remote Config module
   */
  private remoteConfig: FirebaseRemoteConfigTypes.Module

  constructor() {
    this.config = {}
    Object.keys(APP_CONFIG).forEach(key => {
      if (APP_CONFIG[key]) {
        this.config[key] = APP_CONFIG[key]
      }
    })
    this.remoteConfig = RemoteConfigModule()
  }

  async setup() {
    try {
      if (__DEV__) {
        await this.remoteConfig.setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
      }
      await this.remoteConfig.fetch()
      await this.remoteConfig.activate()
      const remoteConfigJSONString = this.remoteConfig.getValue(
        "api_config",
      )
      let remoteConfig = {}
      try {
        remoteConfig = JSON.parse(remoteConfigJSONString.asString())
      } catch (err) {
        console.error(err)
      }
      this.config = {
        ...this.config,
        ...remoteConfig,
      }

      if (this.getValue("SIGNIN_SCREEN_BGIMAGE_URL")) {
        FastImage.preload([
          {
            uri: this.getValue("SIGNIN_SCREEN_BGIMAGE_URL"),
            priority: FastImage.priority.low,
          },
        ])
      }
    } catch (err) {
      console.error(err)
    }
  }

  getAllParams() {
    return this.config
  }

  getValue(key: AppConfigKey) {
    return this.config[key]
  }

  getNumericValue(key: AppConfigKey, defaultValue?: number) {
    return parseInt(this.getValue(key)) || defaultValue
  }

  getIsDeprecatedAppVersion() {
    return (
      this.getNumericValue("MIN_VERSION") > this.getNumericValue("APP_VERSION")
    )
  }

  getGasLimits() {
    return {
      send: this.getValue('GAS_SEND'),
      delegate: this.getValue('GAS_DELEGATE'),
      redelegate: this.getValue('GAS_REDELEGATE'),
      undelegate: this.getValue('GAS_UNDELEGATE'),
      withdraw: this.getValue('GAS_WITHDRAW'),
    }
  }
}

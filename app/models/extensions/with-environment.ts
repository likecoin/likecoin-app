import { getEnv, IStateTreeNode } from "mobx-state-tree"
import { Environment } from "../environment"

import { AppConfigParamKey } from "../../services/app-config"

/**
 * Adds a environment property to the node for accessing our
 * Environment in strongly typed.
 */
export const withEnvironment = (self: IStateTreeNode) => ({
  views: {
    /**
     * The environment.
     */
    get env() {
      return getEnv(self) as Environment
    },
    /**
     * Shortcut for getting the app config.
     */
    getConfig(key: AppConfigParamKey) {
      return this.env.appConfig.getValue(key)
    },

    /**
     * Shortcut for getting the app config in number.
     */
    getNumericConfig(key: AppConfigParamKey, defaultValue?: number): number {
      return this.env.appConfig.getNumericValue(key, defaultValue)
    },
  },
})

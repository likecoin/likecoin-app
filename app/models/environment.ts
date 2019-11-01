import {
  COSMOS_LCD_URL,
  COSMOS_CHAIN_ID,
} from "react-native-dotenv"

import { Reactotron } from "../services/reactotron"
import { LikeCoAPI, LikerLandAPI } from "../services/api"
import { AuthCoreAPI } from "../services/authcore"
import { CosmosAPI } from "../services/cosmos"

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // create each service
    this.reactotron = new Reactotron()
    this.likeCoAPI = new LikeCoAPI()
    this.likerLandAPI = new LikerLandAPI()
    this.authCoreAPI = new AuthCoreAPI()
    this.cosmosAPI = new CosmosAPI(COSMOS_LCD_URL, COSMOS_CHAIN_ID)
  }

  async setup() {
    // allow each service to setup
    await this.reactotron.setup()
    this.likeCoAPI.setup()
    this.likerLandAPI.setup()
  }

  /**
   * Reactotron is only available in dev.
   */
  reactotron: Reactotron

  /**
   * like.co API.
   */
  likeCoAPI: LikeCoAPI

  /**
   * liker.land API.
   */
  likerLandAPI: LikerLandAPI

  /**
   * AuthCore API.
   */
  authCoreAPI: AuthCoreAPI

  /**
   * Cosmos API.
   */
  cosmosAPI: CosmosAPI
}

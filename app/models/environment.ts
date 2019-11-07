import { Reactotron } from "../services/reactotron"
import { LikeCoAPI, LikerLandAPI } from "../services/api"
import { AuthCoreAPI } from "../services/authcore"
import { CosmosAPI } from "../services/cosmos"
import { RemoteConfig } from "../services/remote-config"

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // create each service
    this.remoteConfig = new RemoteConfig()
    this.reactotron = new Reactotron()
    this.likeCoAPI = new LikeCoAPI()
    this.likerLandAPI = new LikerLandAPI()
    this.authCoreAPI = new AuthCoreAPI()
    this.cosmosAPI = null
    this.bigDipper = null
  }

  async setup() {
    // allow each service to setup
    await this.remoteConfig.setup()
    await this.reactotron.setup()
    const {
      COSMOS_LCD_URL,
      COSMOS_CHAIN_ID,
      LIKECO_API_URL,
      LIKERLAND_API_URL,
      BIG_DIPPER_URL,
    } = this.remoteConfig.getConfigObject()
    this.likeCoAPI.setup(LIKECO_API_URL)
    this.likerLandAPI.setup(LIKERLAND_API_URL)
    this.cosmosAPI = new CosmosAPI(COSMOS_LCD_URL, COSMOS_CHAIN_ID)
    this.bigDipper = new BigDipper(BIG_DIPPER_URL)
  }

  remoteConfig: RemoteConfig

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

import { AppConfig } from "../services/app-config"
import { AuthCoreAPI } from "../services/authcore"
import { BigDipper } from "../services/big-dipper"
import { CosmosAPI } from "../services/cosmos"
import { Reactotron } from "../services/reactotron"
import { LikeCoAPI, LikerLandAPI } from "../services/api"

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // create each service
    this.reactotron = new Reactotron()
    this.appConfig = new AppConfig()
    this.authCoreAPI = new AuthCoreAPI()
    this.likeCoAPI = new LikeCoAPI()
    this.likerLandAPI = new LikerLandAPI()
    this.cosmosAPI = new CosmosAPI()
    this.bigDipper = new BigDipper()
  }

  async setup() {
    // allow each service to setup
    await this.reactotron.setup()
    await this.appConfig.setup()
    const {
      COSMOS_LCD_URL,
      COSMOS_CHAIN_ID,
      LIKECO_API_URL,
      LIKERLAND_API_URL,
      BIG_DIPPER_URL,
    } = this.appConfig.getAllParams()
    this.likeCoAPI.setup(LIKECO_API_URL)
    this.likerLandAPI.setup(LIKERLAND_API_URL)
    this.cosmosAPI.setup(COSMOS_LCD_URL, COSMOS_CHAIN_ID)
    this.bigDipper.setup(BIG_DIPPER_URL)
  }

  async setupAuthCore(accessToken?: string) {
    const {
      COSMOS_CHAIN_ID,
      AUTHCORE_ROOT_URL,
    } = this.appConfig.getAllParams()
    await this.authCoreAPI.setup(AUTHCORE_ROOT_URL, COSMOS_CHAIN_ID, accessToken)
  }

  /**
   * The application configurations
   */
  appConfig: AppConfig

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

  /**
   * Big Dipper helper
   */
  bigDipper: BigDipper
}

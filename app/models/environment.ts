import { AppConfig } from "../services/app-config"
import { AuthCoreAPI } from "../services/authcore"
import { BigDipper } from "../services/big-dipper"
import { CosmosAPI } from "../services/cosmos"
import { Reactotron } from "../services/reactotron"
import { LikeCoAPI, LikeCoinAPI, LikerLandAPI } from "../services/api"
import { BranchIO } from "../services/branch-io"
import { initSentry } from "../utils/sentry"

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
    this.likeCoinAPI = new LikeCoinAPI()
    this.likerLandAPI = new LikerLandAPI()
    this.cosmosAPI = new CosmosAPI()
    this.bigDipper = new BigDipper()
    this.branchIO = new BranchIO()
  }

  async setup() {
    // allow each service to setup
    await this.reactotron.setup()
    await this.appConfig.setup()
    await this.branchIO.setup()
    const {
      AUTHCORE_ROOT_URL,
      COSMOS_LCD_URL,
      COSMOS_CHAIN_ID,
      COSMOS_ADDRESS_PREFIX,
      LIKECO_API_URL,
      LIKECOIN_API_URL,
      LIKERLAND_API_URL,
      BIG_DIPPER_URL,
      SENTRY_DSN,
      SENTRY_ENV,
    } = this.appConfig.getAllParams()
    if (SENTRY_DSN) {
      initSentry(SENTRY_DSN, SENTRY_ENV)
    }
    this.authCoreAPI.setup(AUTHCORE_ROOT_URL, COSMOS_CHAIN_ID, COSMOS_ADDRESS_PREFIX)
    this.likeCoAPI.setup(LIKECO_API_URL)
    this.likeCoinAPI.setup(LIKECOIN_API_URL)
    this.likerLandAPI.setup(LIKERLAND_API_URL)
    this.cosmosAPI.setup(COSMOS_LCD_URL, this.appConfig.getGasLimits())
    this.bigDipper.setup(BIG_DIPPER_URL)
  }

  /**
   * The application configurations
   */
  appConfig: AppConfig

  /**
   * Branch.io sdk
   */
  branchIO: BranchIO

  /**
   * Reactotron is only available in dev.
   */
  reactotron: Reactotron

  /**
   * like.co API.
   */
  likeCoAPI: LikeCoAPI

  /**
   * LikeCoin API.
   */
  likeCoinAPI: LikeCoinAPI

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

import { AppConfig } from "../services/app-config"
import { AuthCoreAPI } from "../services/authcore"
import { CosmosAPI } from "../services/cosmos"
import { Mintscan } from "../services/mintscan"
import { Reactotron } from "../services/reactotron"
import {
  LikeCoAPI,
  LikeCoinAPI,
  LikeCoinChainAPI,
  LikerLandAPI,
} from "../services/api"
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
    this.likeCoinChainAPI = new LikeCoinChainAPI()
    this.likerLandAPI = new LikerLandAPI()
    this.cosmosAPI = new CosmosAPI()
    this.mintscan = new Mintscan()
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
      LIKECOIN_CHAIN_API_URL,
      LIKERLAND_URL,
      MINTSCAN_URL,
      SENTRY_DSN,
      SENTRY_ENV,
    } = this.appConfig.getAllParams()
    if (SENTRY_DSN) {
      initSentry(SENTRY_DSN, SENTRY_ENV)
    }
    this.authCoreAPI.setup(AUTHCORE_ROOT_URL, COSMOS_CHAIN_ID, COSMOS_ADDRESS_PREFIX)
    this.likeCoAPI.setup(LIKECO_API_URL)
    this.likeCoinAPI.setup(LIKECOIN_API_URL)
    this.likeCoinChainAPI.setup(LIKECOIN_CHAIN_API_URL)
    this.likerLandAPI.setup(LIKERLAND_URL)
    this.cosmosAPI.setup(COSMOS_LCD_URL, this.appConfig.getGasLimits())
    this.mintscan.setup(MINTSCAN_URL)
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
   * LikeCoin chain API.
   */
  likeCoinChainAPI: LikeCoinChainAPI

  /**
   * Like Land API.
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
   * Mintscan helper
   */
  mintscan: Mintscan
}

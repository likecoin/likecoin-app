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
    this.likeCoAPI = new LikeCoAPI()
    this.likerLandAPI = new LikerLandAPI()
  }

  async setup() {
    // allow each service to setup
    await this.reactotron.setup()
    await this.likeCoAPI.setup()
    await this.likerLandAPI.setup()
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
}

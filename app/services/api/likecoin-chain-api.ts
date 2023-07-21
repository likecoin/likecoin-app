import { ApisauceInstance, create, ApiResponse } from "apisauce"

import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"
import { ApiConfig, COMMON_API_CONFIG } from "./api-config"

export interface NFTClass {
  id: string
  name: string
  description: string
  symbol: string
  uri: string
  uri_hash: string
  config: {
    burnable: boolean
    max_supply: string
    blind_box_config: any
  },
  metadata: {
    image: string
    message: string
    external_url: string
    is_custom_image: string
    nft_meta_collection_id: string
    nft_meta_collection_name: string
    nft_meta_collection_descrption: string
  },
  parent: {
    type: string
    iscn_id_prefix: string
    account: string
  },
  created_at: string
  owner: string
}
export interface NFTClassListResponse {
  classes: NFTClass[]
  pagination: {
    next_key: number
    count: number
  }
}
export type NFTClassListResult = { kind: "ok", data: NFTClass[] } | GeneralApiProblem

export interface NFTEvent {
  action: string
  class_id: string
  nft_id: string
  sender: string
  receiver: string
  tx_hash: string
  timestamp: string
  memo: string
}
export interface NFTEventListResponse { events: NFTEvent[] }
export type NFTEventListResult = { kind: "ok", data: NFTEvent[] } | GeneralApiProblem

/**
 * LikeCoin chain API.
 */
export class LikeCoinChainAPI {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = COMMON_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup(url: string) {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "User-Agent": this.config.userAgent,
        "X-Device-Id": this.config.deviceId
      },
    })
  }

  async fetchNFTClassList({
    iscnOwner,
    nftOwner,
    expand,
    reverse,
    limit,
    key,
  }: {
    iscnOwner?: string
    nftOwner?: string
    expand?: string
    reverse?: boolean
    limit?: string
    key?: string
  } = {}): Promise<NFTClassListResult> {
    const params: any = {}
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (iscnOwner) params.iscn_owner = iscnOwner
    if (nftOwner) params.owner = nftOwner
    if (expand) params.expand = expand
    if (reverse) params['pagination.reverse'] = reverse
    if (limit) params['pagination.limit'] = limit
    if (key) params['pagination.key'] = key
    const response: ApiResponse<NFTClassListResponse> = await this.apisauce.get("/likechain/likenft/v1/class", params)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const { classes } = response.data
    return { kind: "ok", data: classes }
  }

  async fetchNFTEvents({
    classId,
    nftId,
    sender,
    receiver,
    creator,
    involver,
    limit,
    key,
    actionType,
    ignoreToList,
    ignoreFromList,
    reverse,
  }: {
    classId?: string
    nftId?: string
    sender?: string
    receiver?: string
    creator?: string
    involver?: string
    limit?: number
    key?: string
    actionType?: string[]
    ignoreToList?: string
    ignoreFromList?: string
    reverse?: boolean
  }): Promise<NFTEventListResult> {
    const params: any = {}
    /* eslint-disable @typescript-eslint/camelcase */
    if (classId) params.class_id = classId
    if (nftId) params.nft_id = nftId
    if (sender) params.sender = sender
    if (creator) params.creator = creator
    if (receiver) params.receiver = receiver
    if (involver) params.involver = involver
    if (actionType) params.action_type = actionType
    if (ignoreToList) params.ignore_to_list = ignoreToList
    if (ignoreFromList) params.ignore_from_list = ignoreFromList
    if (key) params['pagination.key'] = key
    if (limit) params['pagination.limit'] = limit
    if (reverse) params['pagination.reverse'] = reverse
    /* eslint-enable @typescript-eslint/camelcase */
    const response: ApiResponse<NFTEventListResponse> = await this.apisauce.get("/likechain/likenft/v1/event", params)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const { events } = response.data
    return { kind: "ok", data: events }
  }
}

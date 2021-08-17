// eslint-disable-next-line import/no-extraneous-dependencies
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import {
  QueryClientImpl,
  QueryParamsResponse,
  QueryInflationResponse,
  QueryAnnualProvisionsResponse,
} from "cosmjs-types/cosmos/mint/v1beta1/query";

export interface MintExtension {
  readonly mint: {
    readonly annualProvisions: () => Promise<QueryAnnualProvisionsResponse>;
    readonly inflation: () => Promise<QueryInflationResponse>;
    readonly params: () => Promise<QueryParamsResponse>;
  };
}

export function setupMintExtension(base: QueryClient): MintExtension {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    mint: {
      annualProvisions: () => queryService.AnnualProvisions({}),
      inflation: () =>  queryService.Inflation({}),
      params: () => queryService.Params({}),
    },
  };
}
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { ContractsMerchantService } from './sdk.gen';
import { ContractsRefundPointService } from './sdk.gen';
import { RebateTableHeaderService } from './sdk.gen';
import { RefundFeeHeaderService } from './sdk.gen';
import { RefundTableHeaderService } from './sdk.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ContractServiceClient {

	public readonly contractsMerchant: ContractsMerchantService;
	public readonly contractsRefundPoint: ContractsRefundPointService;
	public readonly rebateTableHeader: RebateTableHeaderService;
	public readonly refundFeeHeader: RefundFeeHeaderService;
	public readonly refundTableHeader: RefundTableHeaderService;

	public readonly request: BaseHttpRequest;

	constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
		this.request = new HttpRequest({
			BASE: config?.BASE ?? '',
			VERSION: config?.VERSION ?? '1',
			WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
			CREDENTIALS: config?.CREDENTIALS ?? 'include',
			TOKEN: config?.TOKEN,
			USERNAME: config?.USERNAME,
			PASSWORD: config?.PASSWORD,
			HEADERS: config?.HEADERS,
			ENCODE_PATH: config?.ENCODE_PATH,
			interceptors: {
				request: config?.interceptors?.request ?? new Interceptors(),
				response: config?.interceptors?.response ?? new Interceptors(),
      },
		});

		this.contractsMerchant = new ContractsMerchantService(this.request);
		this.contractsRefundPoint = new ContractsRefundPointService(this.request);
		this.rebateTableHeader = new RebateTableHeaderService(this.request);
		this.refundFeeHeader = new RefundFeeHeaderService(this.request);
		this.refundTableHeader = new RefundTableHeaderService(this.request);
	}
}

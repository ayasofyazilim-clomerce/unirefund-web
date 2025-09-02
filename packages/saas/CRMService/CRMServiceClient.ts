import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AdminAreaLevel1Service } from './sdk.gen';
import { AdminAreaLevel2Service } from './sdk.gen';
import { CountryService } from './sdk.gen';
import { CustomService } from './sdk.gen';
import { IndividualService } from './sdk.gen';
import { MerchantService } from './sdk.gen';
import { NeighborhoodService } from './sdk.gen';
import { RefundPointService } from './sdk.gen';
import { RegionService } from './sdk.gen';
import { TaxFreeService } from './sdk.gen';
import { TaxOfficeService } from './sdk.gen';
<<<<<<< HEAD
import { UserAffiliationService } from './sdk.gen';
=======
>>>>>>> 047567129113e9eb6683a6e8e085678b3185d274

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class CRMServiceClient {

	public readonly adminAreaLevel1: AdminAreaLevel1Service;
	public readonly adminAreaLevel2: AdminAreaLevel2Service;
	public readonly country: CountryService;
	public readonly custom: CustomService;
	public readonly individual: IndividualService;
	public readonly merchant: MerchantService;
	public readonly neighborhood: NeighborhoodService;
	public readonly refundPoint: RefundPointService;
	public readonly region: RegionService;
	public readonly taxFree: TaxFreeService;
	public readonly taxOffice: TaxOfficeService;
<<<<<<< HEAD
	public readonly userAffiliation: UserAffiliationService;
=======
>>>>>>> 047567129113e9eb6683a6e8e085678b3185d274

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

		this.adminAreaLevel1 = new AdminAreaLevel1Service(this.request);
		this.adminAreaLevel2 = new AdminAreaLevel2Service(this.request);
		this.country = new CountryService(this.request);
		this.custom = new CustomService(this.request);
		this.individual = new IndividualService(this.request);
		this.merchant = new MerchantService(this.request);
		this.neighborhood = new NeighborhoodService(this.request);
		this.refundPoint = new RefundPointService(this.request);
		this.region = new RegionService(this.request);
		this.taxFree = new TaxFreeService(this.request);
		this.taxOffice = new TaxOfficeService(this.request);
<<<<<<< HEAD
		this.userAffiliation = new UserAffiliationService(this.request);
=======
>>>>>>> 047567129113e9eb6683a6e8e085678b3185d274
	}
}

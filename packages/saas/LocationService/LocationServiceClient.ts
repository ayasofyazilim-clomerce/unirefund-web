import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AddressCommonDataService } from './sdk.gen';
import { CityService } from './sdk.gen';
import { CountryService } from './sdk.gen';
import { CountryDateService } from './sdk.gen';
import { CountryNumberService } from './sdk.gen';
import { CountryTimeService } from './sdk.gen';
import { CurrencyService } from './sdk.gen';
import { DistrictService } from './sdk.gen';
import { NeighborhoodService } from './sdk.gen';
import { RegionService } from './sdk.gen';
import { RegionalSettingService } from './sdk.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class LocationServiceClient {

	public readonly addressCommonData: AddressCommonDataService;
	public readonly city: CityService;
	public readonly country: CountryService;
	public readonly countryDate: CountryDateService;
	public readonly countryNumber: CountryNumberService;
	public readonly countryTime: CountryTimeService;
	public readonly currency: CurrencyService;
	public readonly district: DistrictService;
	public readonly neighborhood: NeighborhoodService;
	public readonly region: RegionService;
	public readonly regionalSetting: RegionalSettingService;

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

		this.addressCommonData = new AddressCommonDataService(this.request);
		this.city = new CityService(this.request);
		this.country = new CountryService(this.request);
		this.countryDate = new CountryDateService(this.request);
		this.countryNumber = new CountryNumberService(this.request);
		this.countryTime = new CountryTimeService(this.request);
		this.currency = new CurrencyService(this.request);
		this.district = new DistrictService(this.request);
		this.neighborhood = new NeighborhoodService(this.request);
		this.region = new RegionService(this.request);
		this.regionalSetting = new RegionalSettingService(this.request);
	}
}

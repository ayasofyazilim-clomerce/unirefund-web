import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AddressService } from './sdk.gen';
import { EmailService } from './sdk.gen';
import { EvidenceSessionService } from './sdk.gen';
import { EvidenceSessionPublicService } from './sdk.gen';
import { TelephoneService } from './sdk.gen';
import { TravellerService } from './sdk.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class TravellerServiceClient {

	public readonly address: AddressService;
	public readonly email: EmailService;
	public readonly evidenceSession: EvidenceSessionService;
	public readonly evidenceSessionPublic: EvidenceSessionPublicService;
	public readonly telephone: TelephoneService;
	public readonly traveller: TravellerService;

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

		this.address = new AddressService(this.request);
		this.email = new EmailService(this.request);
		this.evidenceSession = new EvidenceSessionService(this.request);
		this.evidenceSessionPublic = new EvidenceSessionPublicService(this.request);
		this.telephone = new TelephoneService(this.request);
		this.traveller = new TravellerService(this.request);
	}
}

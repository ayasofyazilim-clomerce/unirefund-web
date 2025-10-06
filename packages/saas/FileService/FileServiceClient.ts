import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { FileService } from './sdk.gen';
import { FileAiInfoService } from './sdk.gen';
import { FileRelationService } from './sdk.gen';
import { FileRelationEntityService } from './sdk.gen';
import { FileTypeService } from './sdk.gen';
import { FileTypeGroupService } from './sdk.gen';
import { FileTypeMimeTypeService } from './sdk.gen';
import { MimeTypeService } from './sdk.gen';
import { ProviderService } from './sdk.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class FileServiceClient {

	public readonly file: FileService;
	public readonly fileAiInfo: FileAiInfoService;
	public readonly fileRelation: FileRelationService;
	public readonly fileRelationEntity: FileRelationEntityService;
	public readonly fileType: FileTypeService;
	public readonly fileTypeGroup: FileTypeGroupService;
	public readonly fileTypeMimeType: FileTypeMimeTypeService;
	public readonly mimeType: MimeTypeService;
	public readonly provider: ProviderService;

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

		this.file = new FileService(this.request);
		this.fileAiInfo = new FileAiInfoService(this.request);
		this.fileRelation = new FileRelationService(this.request);
		this.fileRelationEntity = new FileRelationEntityService(this.request);
		this.fileType = new FileTypeService(this.request);
		this.fileTypeGroup = new FileTypeGroupService(this.request);
		this.fileTypeMimeType = new FileTypeMimeTypeService(this.request);
		this.mimeType = new MimeTypeService(this.request);
		this.provider = new ProviderService(this.request);
	}
}

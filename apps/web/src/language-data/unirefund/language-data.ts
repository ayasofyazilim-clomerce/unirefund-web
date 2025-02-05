import type {CoreLanguageDataResourceType} from "../core/core-language-data";
import type {DefaultResource} from "../core/Default";
import type {ContractServiceResource} from "./ContractService";
import type {CRMServiceServiceResource} from "./CRMService";
import type {ExportValidationServiceResource} from "./ExportValidationService";
import type {FinanceServiceResource} from "./FinanceService";
import type {SettingServiceResource} from "./SettingService";
import type {TravellerServiceResource} from "./TravellerService";

export type AppLanguageDataResourceType = DefaultResource &
  (
    | CoreLanguageDataResourceType
    | CRMServiceServiceResource
    | ContractServiceResource
    | FinanceServiceResource
    | ExportValidationServiceResource
    | TravellerServiceResource
    | SettingServiceResource
    | undefined
  );

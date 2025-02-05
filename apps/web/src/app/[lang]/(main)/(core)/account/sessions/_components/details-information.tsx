"use client";
import type {Volo_Abp_Identity_IdentitySessionDto} from "@ayasofyazilim/saas/AccountService";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

export default function DetailsInformation({
  sessionData,
  languageData,
}: {
  sessionData: Volo_Abp_Identity_IdentitySessionDto;
  languageData: AccountServiceResource;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div>
        <strong className="mr-2">{languageData["Sessions.Device"]}:</strong> {sessionData.device}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.DeviceInfo"]}:</strong> {sessionData.deviceInfo}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.userName"]}:</strong> {sessionData.userName}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.clientId"]}:</strong> {sessionData.clientId}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.ipAddresses"]}:</strong> {sessionData.ipAddresses}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.signedIn"]}:</strong> {sessionData.signedIn}
      </div>
      <div>
        <strong className="mr-2">{languageData["Sessions.lastAccessed"]}:</strong> {sessionData.lastAccessed}
      </div>
    </div>
  );
}

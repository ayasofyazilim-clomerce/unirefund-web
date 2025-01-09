"use client";

import type { Volo_Abp_Identity_IdentitySessionDto } from "@ayasofyazilim/saas/IdentityService";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function DetailsInformation({
  sessionData,
  languageData,
}: {
  sessionData: Volo_Abp_Identity_IdentitySessionDto;
  languageData: IdentityServiceResource;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div>
        <strong className="mr-2">{languageData["User.Session.Device"]}:</strong>{" "}
        {sessionData.device}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.DeviceInfo"]}:
        </strong>
        {sessionData.deviceInfo}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.userName"]}:
        </strong>
        {sessionData.userName}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.clientId"]}:
        </strong>
        {sessionData.clientId}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.ipAddresses"]}:
        </strong>
        {sessionData.ipAddresses}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.signedIn"]}:
        </strong>
        {sessionData.signedIn}
      </div>
      <div>
        <strong className="mr-2">
          {languageData["User.Session.lastAccessed"]}:
        </strong>
        {sessionData.lastAccessed}
      </div>
    </div>
  );
}

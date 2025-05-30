"use server";
import {Novu} from "@novu/api";

import {TriggerEventRequestDto} from "@novu/api/models/components";
import {NotificationsControllerListNotificationsRequest} from "@novu/api/models/operations";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";

export type CoreWorkFlowIds = "workflow-1" | "workflow-2" | "workflow-3";
export type ProjectWorkFlowIds = "" | "";

export type TriggerNovuNotification<P> = {
  workflowId: CoreWorkFlowIds | ProjectWorkFlowIds;
  payload: P;
  to: TriggerEventRequestDto["to"];
};

const novu = new Novu({
  serverURL: process.env.NOVU_APP_URL,
  secretKey: process.env.NOVU_SECRET_KEY,
});
const tenant = process.env.TENANT_ID
  ? {
      identifier: process.env.TENANT_ID,
    }
  : null;

export async function triggerNovuNotification<P extends {[k: string]: any}>({
  workflowId,
  payload,
  to,
}: TriggerNovuNotification<P>) {
  try {
    const result = await novu.trigger({
      workflowId,
      payload,
      to,
      tenant: tenant || undefined,
    });
    return result;
  } catch (error) {
    return {
      result: {
        status: "error",
      },
    };
  }
}

export async function getNovuNotificationStatistics() {
  try {
    const result = await novu.notifications.stats.retrieve();
    return structuredSuccessResponse(result.result);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postNovuBroadcast(workflowId: string, payload: {subject: string; message: string}) {
  try {
    const result = await novu.triggerBroadcast({
      name: workflowId,
      payload: payload,
    });
    return structuredSuccessResponse(result);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getNovuNotification(notificationId: string) {
  try {
    const result = await novu.notifications.retrieve(notificationId);
    return structuredSuccessResponse(result.result);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getNovuNotifications(data: NotificationsControllerListNotificationsRequest) {
  try {
    const result = await novu.notifications.list(data);
    return structuredSuccessResponse(result.result);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function postNovuTrigger(
  workflowId: string,
  payload: {subject: string; message: string},
  receivers: string[],
) {
  try {
    const result = await novu.trigger({
      workflowId: workflowId,
      payload: payload,
      to: receivers,
    });
    return structuredSuccessResponse(result);
  } catch (error) {
    throw structuredError(error);
  }
}

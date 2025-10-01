"use client";

import type {Volo_Abp_AuditLogging_AuditLogDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {getAuditLogsDetailsByIdApi} from "@repo/actions/core/AdministrationService/actions";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@repo/ayasofyazilim-ui/atoms/accordion";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@repo/ayasofyazilim-ui/atoms/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@repo/ayasofyazilim-ui/atoms/tabs";
import {useSession} from "next-auth/react";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

type DetailsModalProps = {
  id?: string;
  getDetails?: () => Promise<Volo_Abp_AuditLogging_AuditLogDto | Record<string, unknown>>;
  languageData: AdministrationServiceResource;
  trigger?: React.ReactNode;
};

type TabType = "overall" | "actions";

interface DetailRow {
  label: string;
  value: unknown;
  render?: (v: unknown) => React.ReactNode;
}

const getProperty = (obj: unknown, key: string): unknown => {
  if (obj === null || typeof obj !== "object") return undefined;
  const record = obj as Record<string, unknown>;
  if (key in record) return record[key];
  const lower = key.charAt(0).toLowerCase() + key.slice(1);
  if (lower in record) return record[lower];
  const upper = key.charAt(0).toUpperCase() + key.slice(1);
  return record[upper];
};

const Badge = React.memo<{children: React.ReactNode; variant?: "success" | "default"}>(
  ({children, variant = "default"}) => {
    const bgColor = variant === "success" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
    return (
      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${bgColor}`}>{children}</span>
    );
  },
);
Badge.displayName = "Badge";

const JsonViewer = React.memo<{
  data: unknown;
  onCopy?: (value: unknown) => void;
  getText?: (key: string, defaultValue?: string) => string;
}>(({data, onCopy, getText}) => {
  const formatted = useMemo(() => {
    try {
      if (typeof data === "string") {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const handleClick = useCallback(() => onCopy?.(data), [onCopy, data]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onCopy && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onCopy(data);
      }
    },
    [onCopy, data],
  );

  const getAriaLabel = () => {
    if (!onCopy) return undefined;
    return getText ? getText("Copy JSON", "Copy JSON") : "Copy JSON";
  };

  return (
    <div className="overflow-hidden rounded bg-white p-2 text-xs">
      <div
        aria-label={getAriaLabel()}
        className={onCopy ? "cursor-pointer" : ""}
        onClick={onCopy ? handleClick : undefined}
        onKeyDown={onCopy ? handleKeyDown : undefined}
        role={onCopy ? "button" : undefined}
        tabIndex={onCopy ? 0 : undefined}>
        <pre className="max-w-full whitespace-pre-wrap break-words break-all font-mono text-xs">{formatted}</pre>
      </div>
    </div>
  );
});
JsonViewer.displayName = "JsonViewer";

const CopyButton = React.memo<{
  label: string;
  value: unknown;
  fieldKey: string;
  copiedField: string | null;
  onCopy: (value: unknown, key: string) => void;
  getText?: (key: string, defaultValue?: string) => string;
}>(({label, value, fieldKey, copiedField, onCopy, getText}) => {
  const handleClick = useCallback(() => {
    onCopy(value, fieldKey);
  }, [value, fieldKey, onCopy]);

  return (
    <button
      aria-label={`Copy value for ${label}`}
      className="w-full text-left text-xs text-gray-500 sm:w-1/3"
      data-testid="copy-button"
      onClick={handleClick}
      type="button">
      <span className="select-none">{label}</span>
      {copiedField === fieldKey && (
        <span className="ml-2 text-xs text-green-600">{getText ? getText("Copied", "Copied") : "Copied"}</span>
      )}
    </button>
  );
});
CopyButton.displayName = "CopyButton";

export default function DetailsModal({id, getDetails, languageData, trigger}: DetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Volo_Abp_AuditLogging_AuditLogDto | Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {data: session} = useSession();
  const [tab, setTab] = useState<TabType>("overall");
  const [openActions, setOpenActions] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const actions = useMemo(() => {
    if (!data) return [] as Record<string, unknown>[];
    const a = getProperty(data, "Actions") ?? getProperty(data, "actions");
    return Array.isArray(a) ? (a as Record<string, unknown>[]) : [];
  }, [data]);

  useEffect(() => {
    if (tab === "actions" && actions.length > 0) {
      setOpenActions(actions.map((_, i: number) => `action-${i}`));
    }
  }, [tab, actions]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result: Volo_Abp_AuditLogging_AuditLogDto | Record<string, unknown> | null = null;

      if (getDetails) {
        result = await getDetails();
      } else if (id) {
        const res = await getAuditLogsDetailsByIdApi(id, session);
        if (res.type === "success") {
          result = res.data;
        } else {
          throw new Error(res.message || "Failed to fetch details");
        }
      } else {
        throw new Error("No id or getDetails provided to DetailsModal");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [id, getDetails, session]);

  const copyToClipboard = useCallback(async (value: unknown, key: string) => {
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopiedField(key);
    setTimeout(() => {
      setCopiedField((curr) => (curr === key ? null : curr));
    }, 1500);
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (isOpen) void fetchDetails();
    },
    [fetchDetails],
  );

  const getText = useCallback(
    (key: string, defaultValue = "") => {
      const ld = languageData as unknown as Record<string, string | undefined>;
      return ld[key] ?? defaultValue;
    },
    [languageData],
  );

  const detailRows: DetailRow[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        label: getText("Details.HTTPStatusCode", "HTTP status code"),
        value: getProperty(data, "httpStatusCode") ?? getProperty(data, "status"),
        render: (v) => (v !== null ? <Badge variant="success">{String(v)}</Badge> : null),
      },
      {
        label: getText("Details.HTTPMethod", "HTTP method"),
        value: getProperty(data, "httpMethod") ?? getProperty(data, "http_method"),
        render: (v) => (v ? <Badge>{String(v)}</Badge> : null),
      },
      {label: getText("Details.URL", "URL"), value: getProperty(data, "url") ?? getProperty(data, "path")},
      {
        label: getText("Details.ClientIPAddress", "Client IP Address"),
        value: getProperty(data, "clientIpAddress") ?? getProperty(data, "clientIp"),
      },
      {
        label: getText("Details.ClientName", "Client Name"),
        value: getProperty(data, "clientName") ?? getProperty(data, "clientId"),
      },
      {label: getText("Details.Exceptions", "Exceptions"), value: getProperty(data, "exceptions")},
      {
        label: getText("Details.UserName", "User name"),
        value: getProperty(data, "userName") ?? getProperty(data, "user") ?? getProperty(data, "user_name"),
      },
      {
        label: getText("Details.Time", "Time"),
        value: getProperty(data, "executionTime") ?? getProperty(data, "execution_Time"),
      },
      {
        label: getText("Details.Duration", "Duration"),
        value: getProperty(data, "executionDuration") ?? getProperty(data, "duration"),
      },
      {label: getText("Details.BrowserInfo", "Browser Info"), value: getProperty(data, "browserInfo")},
      {label: getText("Details.ApplicationName", "Application name"), value: getProperty(data, "applicationName")},
      {label: getText("Details.CorrelationId", "Correlation Id"), value: getProperty(data, "correlationId")},
      {label: getText("Details.Comments", "Comments"), value: getProperty(data, "comments")},
      {label: getText("Details.ExtraProperties", "Extra properties"), value: getProperty(data, "extraProperties")},
    ];
  }, [data, getText]);

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild data-testid="details-modal-trigger">
        {trigger ?? (
          <Button className="text-blue-700 underline" data-testid="dialog-open-trigger" variant="ghost">
            {getText("Details", "Details")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getText("Details", "Details")}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 h-[65vh] overflow-auto text-sm">
          {loading ? <div className="p-4">{getText("Loading", "Loading...")}</div> : null}
          {error ? <div className="p-4 text-red-600">{error}</div> : null}

          {!loading && !error && (
            <Tabs
              className="flex h-full flex-col"
              onValueChange={(v) => {
                setTab(v as TabType);
              }}
              value={tab}>
              <TabsList className="bg-muted flex w-full justify-start">
                <TabsTrigger data-testid="tab-trigger-overall" value="overall">
                  {getText("Overall", "Overall")}
                </TabsTrigger>
                <TabsTrigger data-testid="tab-trigger-actions" value="actions">
                  {getText("Actions", "Actions")} {actions.length > 0 && `(${actions.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex-1 overflow-auto" value="overall">
                <div className="h-full overflow-y-auto rounded-md px-2 py-4 shadow-sm">
                  {data ? (
                    <div className="grid grid-cols-1 gap-3">
                      {detailRows.map(({label, value, render}, i) => {
                        const isSimple = ["string", "number", "boolean"].includes(typeof value) || value === null;

                        return (
                          <div
                            className="flex flex-col border-b pb-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
                            key={i}>
                            <CopyButton
                              copiedField={copiedField}
                              fieldKey={`field-${i}`}
                              getText={getText}
                              label={label}
                              onCopy={(...args) => {
                                void copyToClipboard(...args);
                              }}
                              value={value}
                            />

                            <div className="mt-1 w-full text-sm text-gray-800 sm:mt-0 sm:w-2/3">
                              {(() => {
                                if (render) return render(value);
                                if (isSimple) return String(value ?? "");
                                return <JsonViewer data={value} getText={getText} />;
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {getText("No details available", "No details available.")}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent className="flex-1 overflow-auto" value="actions">
                <div className="h-full overflow-auto rounded-md px-2 py-4 shadow-sm">
                  {actions.length === 0 ? (
                    <div className="text-sm text-gray-500">{getText("No actions found", "No actions found.")}</div>
                  ) : (
                    <Accordion className="space-y-3" onValueChange={setOpenActions} type="multiple" value={openActions}>
                      {actions.map((action: Record<string, unknown>, idx: number) => {
                        const serviceName = getProperty(action, "serviceName") ?? "";
                        const methodName = getProperty(action, "methodName") ?? "";
                        const title =
                          (typeof serviceName === "string" ? serviceName : "") +
                            (typeof methodName === "string" && methodName ? ` - ${methodName}` : "") ||
                          (typeof getProperty(action, "Name") === "string"
                            ? (getProperty(action, "Name") as string)
                            : "") ||
                          (typeof getProperty(action, "DisplayName") === "string"
                            ? (getProperty(action, "DisplayName") as string)
                            : "") ||
                          `${getText("Action", "Action")} ${idx + 1}`;

                        const duration = getProperty(action, "executionDuration");
                        const parameters = getProperty(action, "parameters") ?? getProperty(action, "ParametersString");

                        return (
                          <AccordionItem className="rounded-md border" key={idx} value={`action-${idx}`}>
                            <AccordionTrigger className="px-2 py-3 text-left" data-testid="actions-accordion-trigger">
                              <div className="max-w-full break-words break-all text-sm font-medium">{title}</div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 px-4 py-3 text-sm text-gray-800">
                              {duration !== undefined && (
                                <div className="flex justify-between border-b pb-2">
                                  <CopyButton
                                    copiedField={copiedField}
                                    fieldKey={`action-${idx}-duration`}
                                    getText={getText}
                                    label={getText("Duration", "Duration")}
                                    onCopy={(v) => {
                                      void copyToClipboard(v, `action-${idx}-parameters`);
                                    }}
                                    value={duration}
                                  />
                                  <div className="text-sm">{String(duration)}</div>
                                </div>
                              )}
                              {parameters !== undefined && parameters !== null && (
                                <div className="overflow-hidden">
                                  <CopyButton
                                    copiedField={copiedField}
                                    fieldKey={`action-${idx}-parameters`}
                                    getText={getText}
                                    label={getText("Parameters", "Parameters")}
                                    onCopy={(val, key) => {
                                      void copyToClipboard(val, key);
                                    }}
                                    value={parameters}
                                  />
                                  <JsonViewer
                                    data={parameters}
                                    getText={getText}
                                    onCopy={(v) => {
                                      void copyToClipboard(v, `action-${idx}-parameters`);
                                    }}
                                  />
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

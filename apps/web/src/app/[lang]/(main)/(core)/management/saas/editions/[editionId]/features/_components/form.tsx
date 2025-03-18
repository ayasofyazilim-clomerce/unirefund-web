"use client";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {
  UniRefund_AdministrationService_Settings_ValueTypes_ValueTypeModelDto,
  Volo_Abp_FeatureManagement_FeatureGroupDto,
  Volo_Abp_FeatureManagement_GetFeatureListResultDto,
  Volo_Abp_FeatureManagement_UpdateFeatureDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {SectionLayout, SectionLayoutContent} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {putFeaturesApi} from "@repo/actions/core/AdministrationService/put-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function FeatureManagement({
  languageData,
  featuresData,
}: {
  languageData: SaasServiceResource;
  featuresData: Volo_Abp_FeatureManagement_GetFeatureListResultDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {editionId} = useParams<{editionId: string}>();
  const [featureGroups] = useState<Volo_Abp_FeatureManagement_FeatureGroupDto[]>(() => featuresData.groups || []);
  const [updatedFeatures, setUpdatedFeatures] = useState<Volo_Abp_FeatureManagement_UpdateFeatureDto[]>([]);

  const updateFeature = (name: string, value: string) => {
    setUpdatedFeatures((prev) => {
      const existingIndex = prev.findIndex((f) => f.name === name);
      if (existingIndex >= 0) {
        prev[existingIndex].value = value;
      } else {
        prev.push({name, value});
      }
      return [...prev];
    });
  };

  return (
    <div className="relative flex h-screen flex-col pb-56">
      <SectionLayout
        sections={featureGroups.map((group) => ({
          name: group.displayName || "",
          id: group.name || "",
        }))}
        vertical>
        {featureGroups.map((group) => (
          <SectionLayoutContent key={group.name} sectionId={group.name || ""}>
            {group.features?.map((feature) => {
              const currentValue = updatedFeatures.find((f) => f.name === feature.name)?.value ?? feature.value;

              const isChildFeature = (feature.depth && feature.depth > 0) || feature.parentName;
              const indentClass = isChildFeature ? "pl-6" : "";

              return (
                <div className={`mb-2 ${indentClass}`} key={feature.name}>
                  {(() => {
                    if (feature.valueType?.name === "ToggleStringValueType") {
                      return (
                        <>
                          <div className="flex items-center">
                            <Checkbox
                              checked={String(currentValue).toLowerCase() === "true"}
                              onCheckedChange={(checked) => {
                                updateFeature(feature.name || "", checked ? "True" : "False");
                              }}
                            />
                            <span className="ml-2 text-sm font-medium">{feature.displayName}</span>
                          </div>
                          {feature.description ? (
                            <div className="text-muted-foreground mt-1 text-sm">{feature.description}</div>
                          ) : null}
                        </>
                      );
                    }

                    if (feature.valueType?.name === "SelectionStringValueType") {
                      const selectionValueType =
                        feature.valueType as UniRefund_AdministrationService_Settings_ValueTypes_ValueTypeModelDto;

                      return (
                        <>
                          <Label className="block text-sm font-medium">{feature.displayName}</Label>
                          <div className="mt-1">
                            <Select
                              onValueChange={(value) => {
                                updateFeature(feature.name || "", value);
                              }}
                              value={currentValue || ""}>
                              <SelectTrigger className="w-[800px]">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {selectionValueType.itemSource?.items?.map((item, idx) => (
                                  <SelectItem key={idx} value={item.value || ""}>
                                    {item.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {feature.description ? (
                            <div className="text-muted-foreground mt-1 text-sm">{feature.description}</div>
                          ) : null}
                        </>
                      );
                    }

                    if (feature.valueType?.name === "FreeTextStringValueType") {
                      return (
                        <>
                          <Label className="block text-sm font-medium">{feature.displayName}</Label>
                          <div className="mt-1">
                            <Input
                              className="w-[800px]"
                              onChange={(e) => {
                                updateFeature(feature.name || "", e.target.value);
                              }}
                              placeholder={feature.displayName || ""}
                              type="number"
                              value={currentValue || ""}
                            />
                          </div>
                          {feature.description ? (
                            <div className="text-muted-foreground mt-1 text-sm">{feature.description}</div>
                          ) : null}
                        </>
                      );
                    }

                    return (
                      <>
                        <Label className="block text-sm font-medium">{feature.displayName}</Label>
                        <div className="mt-1">
                          <Input
                            className="w-[180px]"
                            onChange={(e) => {
                              updateFeature(feature.name || "", e.target.value);
                            }}
                            placeholder={feature.displayName || ""}
                            value={currentValue || ""}
                          />
                        </div>
                        {feature.description ? (
                          <div className="text-muted-foreground mt-1 text-sm">{feature.description}</div>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              );
            })}
          </SectionLayoutContent>
        ))}
      </SectionLayout>

      <div className="fixed bottom-0 left-0 flex w-full justify-end bg-white pb-4 pr-16">
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              void putFeaturesApi({
                providerName: "E",
                providerKey: editionId,
                requestBody: {features: updatedFeatures},
              }).then((res) => {
                handlePutResponse(res, router, "..");
              });
            });
          }}>
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}

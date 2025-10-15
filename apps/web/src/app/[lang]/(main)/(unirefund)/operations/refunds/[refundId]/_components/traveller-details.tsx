import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import type {
  UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto as TravellerDetailProfileDto,
} from "@repo/saas/TravellerService";
import {IdCard, User} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import {IconWithTitle} from "./icon-with-title";
import {TextWithSubText} from "./text-with-subtext";

export function TravellerDetails({
  traveller,
  lang,
}: {
  traveller: Partial<TravellerDetailProfileDto> & {travellerDocumentNumber: string};
  lang: string;
}) {
  const travellerLink = getBaseLink(`parties/travellers/${traveller.id}`, lang);
  return (
    <div className="grid max-h-full overflow-y-auto p-4 pb-[50%]">
      <IconWithTitle icon={User} title="Traveller details" />
      <div className="mt-2 grid w-full gap-6">
        <TextWithSubText
          subText={
            <Link className="font-semibold text-blue-500" data-testid="traveller-link" href={travellerLink}>
              {traveller.travellerDocumentNumber}
            </Link>
          }
          text="Travel document number"
        />
        <TravellerPersonalIdentifications
          lang={lang}
          personalIdentifications={traveller.travellerDocuments}
          travellerLink={travellerLink}
        />
      </div>
    </div>
  );
}

function TravellerPersonalIdentifications({
  personalIdentifications,
  travellerLink,
  lang,
}: {
  personalIdentifications:
    | UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto[]
    | undefined
    | null;
  travellerLink: string;
  lang: string;
}) {
  if (!personalIdentifications || personalIdentifications.length === 0) {
    return null;
  }
  if (personalIdentifications.length === 1) {
    return (
      <TravellerPersonalIdentification
        identification={personalIdentifications[0]}
        lang={lang}
        showDocumentNumber={false}
        travellerLink={travellerLink}
      />
    );
  }
  return (
    <Accordion className="w-full space-y-2" type="multiple">
      {personalIdentifications.map((identification) => (
        <AccordionItem
          className="border-none [&>div]:-mt-4"
          key={identification.travellerDocumentNumber}
          value={identification.travellerDocumentNumber || ""}>
          <AccordionTrigger className="rounded-md border px-2" data-testid="traveller-accordion-trigger">
            <IconWithTitle
              classNames={{icon: "size-4", title: "text-sm font-normal"}}
              icon={IdCard}
              title={identification.travellerDocumentNumber || ""}
            />
          </AccordionTrigger>
          <AccordionContent className="rounded-b-md border border-t-0 p-2 pt-6">
            <TravellerPersonalIdentification
              identification={identification}
              lang={lang}
              travellerLink={travellerLink}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function TravellerPersonalIdentification({
  identification,
  showDocumentNumber = true,
  lang,
  travellerLink,
}: {
  identification: UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto;
  showDocumentNumber?: boolean;
  lang: string;
  travellerLink: string;
}) {
  return (
    <div className="grid gap-2">
      {showDocumentNumber ? (
        <TextWithSubText
          subText={
            <Link
              className="font-semibold text-blue-500"
              data-testid="traveller-personal-identification-link"
              href={`${travellerLink}/${identification.id}`}>
              {identification.travellerDocumentNumber}
            </Link>
          }
          text="Travel document number"
        />
      ) : null}
      <TextWithSubText subText={identification.identificationType} text="Document type" />
      <TextWithSubText subText={identification.residenceCountryName || "-"} text="Country of residence" />
      <TextWithSubText subText={identification.nationalityCountryName || "-"} text="Nationality" />
      <TextWithSubText
        subText={identification.birthDate ? new Date(identification.birthDate).toLocaleDateString(lang) : "-"}
        text="Date of birth"
      />
    </div>
  );
}

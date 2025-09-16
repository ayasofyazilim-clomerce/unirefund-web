"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ayasofyazilim-ui/atoms/popover"
import { UniRefund_CRMService_UserAffiliations_UserAffiliationDto as Affiliation } from "@repo/saas/CRMService"
import FileTree from "./tree"
import { Store } from "lucide-react"
import { Button } from "@repo/ayasofyazilim-ui/atoms/button"

export function AffiliationSwitcher({
    activeIds,
    affiliations,
}: {
    activeIds: string[]
    affiliations: Affiliation[]
}) {
    const activeId = activeIds[0];
    const active = affiliations.find((aff) => aff.partyId === activeId);
    return (
        <div className="space-y-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="gap-1" variant="outline">
                        {active?.parentId === null && <Store className="w-4" />}
                        <span>{active?.partyName}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <FileTree activeIds={activeIds} affiliations={affiliations} />
                </PopoverContent>
            </Popover>
        </div>
    )
}


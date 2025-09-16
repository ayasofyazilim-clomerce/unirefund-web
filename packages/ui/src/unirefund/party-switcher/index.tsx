"use client"
import { Label } from "@repo/ayasofyazilim-ui/atoms/label"
import { CheckboxTree } from "@repo/ayasofyazilim-ui/atoms/checkbox-tree"
import { Checkbox } from "@repo/ayasofyazilim-ui/atoms/checkbox"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@repo/ayasofyazilim-ui/atoms/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@repo/ayasofyazilim-ui/atoms/select"
import { Fragment, useId } from "react"
import { cn } from "../../utils"
import { UniRefund_CRMService_UserAffiliations_UserAffiliationDto as Affiliation } from "@repo/saas/CRMService"
import { Check, Minus } from "lucide-react"




export function PartySwitcher({
    activeIds,
    affiliations,
}: {
    activeIds: string[]
    affiliations: Affiliation[]
}) {
    const id = useId()
    const activeId = activeIds[0];
    const active = affiliations.find((aff) => aff.partyId === activeId);
    const parentAffiliations = affiliations.filter((aff) => aff.parentId === null);

    return (
        <div className="*:not-first:mt-2">
            <Select defaultValue={activeId}>
                <SelectTrigger
                    id={id}
                    className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0 min-w-52 shadow-none"
                >
                    <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                    {parentAffiliations.map((affiliation) => {
                        const childrenAffiliations = affiliations.filter((aff) => aff.parentId === affiliation.partyId);
                        return (
                            <SelectGroup>
                                <SelectItem value={affiliation.partyId || ""} className="">
                                    <span className="flex items-center gap-2">
                                        {activeId == affiliation.partyId && <Square isActive />}
                                        {affiliation.partyName}
                                    </span>
                                </SelectItem>
                                {childrenAffiliations.map((childAffiliation) => {
                                    const isActive = activeIds.includes(childAffiliation.partyId || "");
                                    return (
                                        <SelectItem value={childAffiliation.partyId || ""} className="!pl-8">
                                            <span className="flex items-center gap-2">
                                                {isActive && <Square isActive={isActive} />}
                                                {childAffiliation.partyName}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        )
                    })}
                </SelectContent>
            </Select>
        </div>
    )
}

function Square({ isActive }: { isActive: boolean }) {
    if (isActive) return <SquareCore className="bg-green-400/20 text-green-500">
        <Check className="w-4" />
    </SquareCore>
    return <SquareCore className="bg-muted text-muted-foreground">
        <Minus className="w-4" />
    </SquareCore>
}
function SquareCore({
    className,
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <span
            data-square
            className={cn(
                "bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium",
                className
            )}
            aria-hidden="true"
        >
            {children}
        </span>
    )
}
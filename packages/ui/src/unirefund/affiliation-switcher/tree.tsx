"use client"

import React, { useEffect, useRef, useState } from "react"
import { UniRefund_CRMService_UserAffiliations_UserAffiliationDto as Affiliation } from "@repo/saas/CRMService"

import {
    CircleXIcon,
    FilterIcon,
    HatGlasses,
    FolderIcon,
    FolderOpenIcon,
    Check,
    Eye,
    Building,
    Store,
} from "lucide-react"
import {
    checkboxesFeature,
    expandAllFeature,
    hotkeysCoreFeature,
    searchFeature,
    selectionFeature,
    syncDataLoaderFeature,
    TreeState, useTree
} from "@repo/ayasofyazilim-ui/atoms/headless-tree"
import { Tree, TreeItem, TreeItemLabel } from "@repo/ayasofyazilim-ui/atoms/tree"
import { Input } from "@repo/ayasofyazilim-ui/atoms/input"
import { Button } from "@repo/ayasofyazilim-ui/atoms/button"
import { cn } from "../../utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ayasofyazilim-ui/atoms/tooltip"

interface Item {
    name: string
    children?: string[]
}

const indent = 40;

function convertAffiliationsToTree(
    affiliations: Affiliation[],
): Record<string, Item> {
    const result: Record<string, Item> = {};
    affiliations.forEach(item => {
        result[item.partyId || ""] = {
            name: item.partyName || ""
        };
    });
    affiliations.forEach(item => {
        if (item.parentId && result[item.parentId]) {
            if (!result[item.parentId].children) {
                result[item.parentId].children = [];
            }
            result[item.parentId].children!.push(item.partyId || "");
        }
    });

    const parents = affiliations.filter((aff) => aff.partyId && aff.parentId === null && aff.partyId).map((aff) => aff.partyId || "");
    return {
        "root": {
            name: "Root",
            children: parents,
        },
        ...result
    }
}

export default function Component({
    activeIds,
    affiliations,
}: {
    activeIds: string[]
    affiliations: Affiliation[]
}) {
    const activeId = activeIds[0];
    const items = convertAffiliationsToTree(affiliations);
    // const [activeId] = affiliations.map((aff) => {
    //     if (aff.parentId === null && aff.partyId) return aff.partyId || ""
    //     else return null
    // }).filter((aff) => aff !== null);



    const [state, setState] = useState<Partial<TreeState<Item>>>({})
    const [searchValue, setSearchValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const tree = useTree<Item>({
        state,
        setState,
        initialState: {
            expandedItems: [activeId],
        },
        indent,
        rootItemId: "root",
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
        dataLoader: {
            getItem: (itemId) => items[itemId],
            getChildren: (itemId) => items[itemId].children ?? [],
        },
        features: [
            syncDataLoaderFeature,
            hotkeysCoreFeature,
            selectionFeature,
            searchFeature,
            checkboxesFeature,
            expandAllFeature,
        ],
    })

    // Handle clearing the search
    const handleClearSearch = () => {
        setSearchValue("")

        // Manually trigger the tree's search onChange with an empty value
        // to ensure item.isMatchingSearch() is correctly updated.
        const searchProps = tree.getSearchInputElementProps()
        if (searchProps.onChange) {
            const syntheticEvent = {
                target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement> // Cast to the expected event type
            searchProps.onChange(syntheticEvent)
        }

        // Reset tree state to initial expanded items
        setState((prevState) => ({
            ...prevState,
            expandedItems: [activeId],
        }))

        // Clear custom filtered items
        setFilteredItems([])

        if (inputRef.current) {
            inputRef.current.focus()
            // Also clear the internal search input
            inputRef.current.value = ""
        }
    }

    // Keep track of filtered items separately from the tree's internal search state
    const [filteredItems, setFilteredItems] = useState<string[]>([])

    // This function determines if an item should be visible based on our custom filtering
    const shouldShowItem = (itemId: string) => {
        if (!searchValue || searchValue.length === 0) return true
        return filteredItems.includes(itemId)
    }

    // Update filtered items when search value changes
    useEffect(() => {
        if (!searchValue || searchValue.length === 0) {
            setFilteredItems([])
            return
        }

        // Get all items
        const allItems = tree.getItems()

        // First, find direct matches
        const directMatches = allItems
            .filter((item) => {
                const name = item.getItemName().toLowerCase()
                return name.includes(searchValue.toLowerCase())
            })
            .map((item) => item.getId())

        // Then, find all parent IDs of matching items
        const parentIds = new Set<string>()
        directMatches.forEach((matchId) => {
            let item = tree.getItems().find((i) => i.getId() === matchId)
            while (item?.getParent && item.getParent()) {
                const parent = item.getParent()
                if (parent) {
                    parentIds.add(parent.getId())
                    item = parent
                } else {
                    break
                }
            }
        })

        // Find all children of matching items
        const childrenIds = new Set<string>()
        directMatches.forEach((matchId) => {
            const item = tree.getItems().find((i) => i.getId() === matchId)
            if (item && item.isFolder()) {
                // Get all descendants recursively
                const getDescendants = (itemId: string) => {
                    const children = items[itemId]?.children || []
                    children.forEach((childId) => {
                        childrenIds.add(childId)
                        if (items[childId]?.children?.length) {
                            getDescendants(childId)
                        }
                    })
                }

                getDescendants(item.getId())
            }
        })

        // Combine direct matches, parents, and children
        setFilteredItems([
            ...directMatches,
            ...Array.from(parentIds),
            ...Array.from(childrenIds),
        ])

        // Keep all folders expanded during search to ensure all matches are visible
        // Store current expanded state first
        const currentExpandedItems = tree.getState().expandedItems || []

        // Get all folder IDs that need to be expanded to show matches
        const folderIdsToExpand = allItems
            .filter((item) => item.isFolder())
            .map((item) => item.getId())

        // Update expanded items in the tree state
        setState((prevState) => ({
            ...prevState,
            expandedItems: [
                ...new Set([...currentExpandedItems, ...folderIdsToExpand]),
            ],
        }))
    }, [searchValue, tree])

    const [selected, setSelected] = useState<string>()
    return (
        <div className="flex h-full flex-col gap-2 *:nth-2:grow">
            <div className="relative">
                <Input
                    ref={inputRef}
                    className="peer pl-9"
                    value={searchValue}
                    onChange={(e) => {
                        const value = e.target.value
                        setSearchValue(value)

                        // Apply the search to the tree's internal state as well
                        const searchProps = tree.getSearchInputElementProps()
                        if (searchProps.onChange) {
                            searchProps.onChange(e)
                        }

                        if (value.length > 0) {
                            // If input has at least one character, expand all items
                            tree.expandAll()
                        } else {
                            // If input is cleared, reset to initial expanded state
                            setState((prevState) => ({
                                ...prevState,
                                expandedItems: [activeId],
                            }))
                            setFilteredItems([])
                        }
                    }}
                    // Prevent the internal search from being cleared on blur
                    onBlur={(e) => {
                        // Prevent default blur behavior
                        e.preventDefault()

                        // Re-apply the search to ensure it stays active
                        if (searchValue && searchValue.length > 0) {
                            const searchProps = tree.getSearchInputElementProps()
                            if (searchProps.onChange) {
                                const syntheticEvent = {
                                    target: { value: searchValue },
                                } as React.ChangeEvent<HTMLInputElement>
                                searchProps.onChange(syntheticEvent)
                            }
                        }
                    }}
                    type="search"
                    placeholder="Filter items..."
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <FilterIcon className="size-4" aria-hidden="true" />
                </div>
                {searchValue && (
                    <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Clear search"
                        onClick={handleClearSearch}
                    >
                        <CircleXIcon className="size-4" aria-hidden="true" />
                    </button>
                )}
            </div>
            <Tree indent={indent} tree={tree}>
                {searchValue && filteredItems.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm">
                        No items found for "{searchValue}"
                    </p>
                ) : (
                    tree.getItems().map((item) => {
                        const isVisible = shouldShowItem(item.getId())

                        return (
                            <div
                                key={item.getId()}
                                className="flex items-center gap-2 not-last:pb-0.5 flex-1"
                            >
                                <TreeItem
                                    key={item.getId()}
                                    item={item}
                                    data-visible={isVisible || !searchValue}
                                    className={cn("data-[visible=false]:hidden w-full")}
                                >
                                    <TreeItemLabel
                                        onClick={() => { setSelected(item.getId()) }}
                                        className={cn(selected === item.getId() && "font-medium bg-muted")}>
                                        <span className="flex items-center gap-2 w-full">
                                            {item.isFolder() && <Store className="text-muted-foreground pointer-events-none size-4" />}
                                            {item.getItemName()}
                                        </span>
                                    </TreeItemLabel>
                                </TreeItem>
                            </div>
                        )
                    })
                )}
            </Tree>
            <Button className="gap-1">
                <span>
                    {selected === activeId ? "Acting as" : "Act as"}
                </span>
                <span>
                    {affiliations.find(aff => aff.partyId === selected)?.partyName}
                </span>
            </Button>
        </div>
    )
}

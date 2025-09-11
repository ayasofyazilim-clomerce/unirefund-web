"use client";

import {useState, useEffect} from "react";
import {Tabs, TabsList, TabsTrigger} from "@repo/ayasofyazilim-ui/atoms/tabs";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Input} from "@repo/ayasofyazilim-ui/atoms/input";
import {MapPin, List, Search} from "lucide-react";
import dynamic from "next/dynamic";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import type {TaxFreePoint} from "./types";

// Dynamic import of the map component to prevent SSR issues
const MapComponent = dynamic(() => import("./components/map"), {ssr: false});

interface ExploreClientProps {
  initialPoints: TaxFreePoint[];
  languageData: SSRServiceResource;
}

export default function ExploreClient({initialPoints, languageData}: ExploreClientProps) {
  const [activeView, setActiveView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPoints, setFilteredPoints] = useState(initialPoints);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Filter tax-free points based on search query only
  useEffect(() => {
    const filtered = initialPoints.filter((point) => {
      return (
        searchQuery === "" ||
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredPoints(filtered);
  }, [searchQuery, initialPoints]);
  return (
    <div className="mobile-fullscreen relative mx-auto h-full w-full space-y-6 px-0 py-0 md:container md:px-8 md:py-4">
      {/* Mobile View - Full screen map with overlays */}
      <div className="relative h-full md:hidden">
        {/* Full screen map */}
        {activeView === "map" && (
          <>
            <div className="absolute inset-0 z-0">
              <MapComponent points={filteredPoints} />
            </div>

            {/* Floating header overlay */}
            <div className="absolute left-0 right-0 top-0 z-10 border-b bg-white/95 shadow-sm backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold">{languageData["Explore.Title"]}</h1>
                    <p className="text-muted-foreground text-sm">{languageData["Explore.Description"]}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowSearch(!showSearch);
                    }}
                    size="sm"
                    variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Collapsible search */}
                {showSearch ? (
                  <div className="mt-3">
                    <div className="relative">
                      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                      <Input
                        className="pl-10"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        placeholder={languageData["Explore.SearchPlaceholder"]}
                        value={searchQuery}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Results counter overlay */}
            {filteredPoints.length > 0 && (
              <div className="absolute bottom-24 right-4 z-10">
                <div className="rounded-full bg-black/80 px-3 py-2 text-xs text-white">
                  {filteredPoints.length} {languageData["Explore.Points"]}
                </div>
              </div>
            )}
          </>
        )}

        {activeView === "list" && (
          <div className="h-full overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white p-4 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">{languageData["Explore.Title"]}</h1>
                  <p className="text-muted-foreground text-sm">{languageData["Explore.Description"]}</p>
                </div>
                <Button
                  onClick={() => {
                    setShowSearch(!showSearch);
                  }}
                  size="sm"
                  variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Collapsible search for list view */}
              {showSearch ? (
                <div className="mt-2">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      className="pl-10"
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      placeholder={languageData["Explore.SearchPlaceholder"]}
                      value={searchQuery}
                    />
                  </div>
                </div>
              ) : null}

              {/* Tabs bar for list view, just below search input */}
              <div className="justify-left mt-2 flex">
                <div className="w-fit rounded-md border bg-white px-1 shadow-sm">
                  <Tabs
                    onValueChange={(v) => {
                      setActiveView(v as "map" | "list");
                    }}
                    value={activeView}>
                    <TabsList className="flex gap-1 bg-transparent p-0">
                      <TabsTrigger
                        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-md"
                        value="map">
                        <MapPin className="h-4 w-4" />
                        {languageData["Explore.MapTab"]}
                      </TabsTrigger>
                      <hr className="h-6 border-l border-gray-200" />
                      <TabsTrigger
                        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-md"
                        value="list">
                        <List className="h-4 w-4" />
                        {languageData["Explore.ListTab"]}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* List content */}
            <div className="space-y-4 p-4">
              {filteredPoints.length > 0 ? (
                filteredPoints.map((point) => (
                  <div
                    className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl"
                    key={point.id}>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-50/0 to-red-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-red-600">
                            {point.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                            {point.category}
                          </span>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-shadow duration-200 group-hover:shadow-lg">
                            %{point.returnRate} {languageData["Explore.ReturnRate"]}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            {Array.from({length: 5}, (_, i) => (
                              <span
                                className={`text-base ${i < Math.floor(point.rating) ? "text-amber-400" : "text-gray-300"}`}
                                key={i}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{point.rating}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-start">
                          <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                          <p className="text-sm leading-relaxed text-gray-600">{point.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-sm">
                    <Search className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{languageData["Explore.NoResultsTitle"]}</h3>
                  <p className="mb-8 max-w-sm text-sm text-gray-500">{languageData["Explore.NoResults"]}</p>
                  <Button
                    className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                    onClick={() => {
                      setSearchQuery("");
                    }}
                    size="sm">
                    {languageData["Explore.Clear"]}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating bottom controls - only show on map view for mobile */}
        {activeView === "map" && (
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
            <div className="w-fit rounded-full border bg-white px-1 shadow-sm">
              <Tabs
                onValueChange={(v) => {
                  setActiveView(v as "map" | "list");
                }}
                value={activeView}>
                <TabsList className="flex gap-1 bg-transparent p-0">
                  <TabsTrigger
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-md"
                    value="map">
                    <MapPin className="h-4 w-4" />
                    {languageData["Explore.MapTab"]}
                  </TabsTrigger>
                  <hr className="h-6 border-l border-gray-200" />
                  <TabsTrigger
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-md"
                    value="list">
                    <List className="h-4 w-4" />
                    {languageData["Explore.ListTab"]}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}
      </div>
      {/* Desktop View - Clean modern layout similar to the screenshot */}
      <div className="hidden h-full md:block">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-xl font-bold lg:text-2xl">{languageData["Explore.Title"]}</h1>
              <p className="text-muted-foreground text-sm">{languageData["Explore.Description"]}</p>
            </div>
            <div className="lg:1/2 relative md:w-1/3">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                className="h-9 border-gray-200 pl-10"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder={languageData["Explore.SearchPlaceholder"]}
                value={searchQuery}
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Map/List toggle buttons */}
              <div className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <button
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeView === "map"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveView("map");
                  }}>
                  <MapPin className="h-4 w-4" />
                  {languageData["Explore.MapTab"]}
                </button>
                <button
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeView === "list"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveView("list");
                  }}>
                  <List className="h-4 w-4" />
                  {languageData["Explore.ListTab"]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="h-[calc(100%-4rem)] w-full">
          {activeView === "map" && (
            <div className="h-full w-full overflow-hidden rounded-lg border">
              <MapComponent points={filteredPoints} />
            </div>
          )}

          {activeView === "list" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredPoints.length > 0 ? (
                filteredPoints.map((point) => (
                  <div
                    className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl"
                    key={point.id}>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-50/0 to-red-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-3 text-lg font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-red-600">
                            {point.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                            {point.category}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 text-sm font-bold text-white shadow-md transition-shadow duration-200 group-hover:shadow-lg">
                            %{point.returnRate} {languageData["Explore.ReturnRate"]}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {Array.from({length: 5}, (_, i) => (
                              <span
                                className={`text-base ${i < Math.floor(point.rating) ? "text-amber-400" : "text-gray-300"}`}
                                key={i}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{point.rating}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-start">
                          <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                          <p className="text-sm leading-relaxed text-gray-600">{point.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-sm">
                    <Search className="h-12 w-12 text-red-400" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-800">{languageData["Explore.NoResultsTitle"]}</h3>
                  <p className="mb-8 max-w-md text-base text-gray-500">{languageData["Explore.NoResults"]}</p>
                  <Button
                    className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                    onClick={() => {
                      setSearchQuery("");
                    }}>
                    {languageData["Explore.ClearSearch"]}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

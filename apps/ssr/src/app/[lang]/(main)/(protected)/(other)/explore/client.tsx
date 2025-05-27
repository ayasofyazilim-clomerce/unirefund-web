"use client";

import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@repo/ayasofyazilim-ui/atoms/card";
import {Tabs, TabsList, TabsTrigger} from "@repo/ayasofyazilim-ui/atoms/tabs";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Input} from "@repo/ayasofyazilim-ui/atoms/input";
import {Badge} from "@repo/ayasofyazilim-ui/atoms/badge";
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
                        className="data-[state=active]:text-primary flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors data-[state=active]:font-semibold data-[state=active]:shadow-none"
                        value="map">
                        <MapPin className="h-4 w-4" />
                        {languageData["Explore.MapTab"]}
                      </TabsTrigger>
                      <hr className="h-6 border-l border-gray-200" />
                      <TabsTrigger
                        className="data-[state=active]:text-primary flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors data-[state=active]:font-semibold data-[state=active]:shadow-none"
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
                  <Card className="overflow-hidden" key={point.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{point.name}</CardTitle>
                        <Badge>{point.returnRate}% </Badge>
                      </div>
                      <Badge variant="outline">{point.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex items-center">
                        <div className="flex">
                          {Array.from({length: 5}, (_, i) => (
                            <span
                              className={`text-sm ${i < Math.floor(point.rating) ? "text-yellow-500" : "text-gray-300"}`}
                              key={i}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-muted-foreground ml-2 text-sm">{point.rating}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{point.address}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">{languageData["Explore.NoResults"]}</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                    }}
                    variant="link">
                    {languageData.Search}
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
                    className="data-[state=active]:text-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors data-[state=active]:font-semibold data-[state=active]:shadow-none"
                    value="map">
                    <MapPin className="h-4 w-4" />
                    {languageData["Explore.MapTab"]}
                  </TabsTrigger>
                  <hr className="h-6 border-l border-gray-200" />
                  <TabsTrigger
                    className="data-[state=active]:text-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors data-[state=active]:font-semibold data-[state=active]:shadow-none"
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
              <div className="flex overflow-hidden rounded-md border">
                <button
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm ${activeView === "map" ? "bg-gray-100 font-medium" : "bg-white"}`}
                  onClick={() => {
                    setActiveView("map");
                  }}>
                  <MapPin className="h-3.5 w-3.5" />
                  {languageData["Explore.MapTab"]}
                </button>
                <button
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm ${activeView === "list" ? "bg-gray-100 font-medium" : "bg-white"}`}
                  onClick={() => {
                    setActiveView("list");
                  }}>
                  <List className="h-3.5 w-3.5" />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPoints.length > 0 ? (
                filteredPoints.map((point) => (
                  <Card className="overflow-hidden transition-shadow hover:shadow-md" key={point.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{point.name}</CardTitle>
                        <Badge>{point.returnRate}% Return</Badge>
                      </div>
                      <Badge variant="outline">{point.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex items-center">
                        <div className="flex">
                          {Array.from({length: 5}, (_, i) => (
                            <span
                              className={`text-sm ${i < Math.floor(point.rating) ? "text-yellow-500" : "text-gray-300"}`}
                              key={i}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-muted-foreground ml-2 text-sm">{point.rating}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{point.address}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">{languageData["Explore.NoResults"]}</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                    }}
                    variant="link">
                    {languageData.Search}
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

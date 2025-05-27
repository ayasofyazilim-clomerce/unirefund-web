"use client";

import {useEffect, useRef} from "react";
import L from "leaflet";
import type {TaxFreePoint} from "../types";
import "leaflet/dist/leaflet.css";

// This is a placeholder for the map component
// In a real implementation, you would use a library like react-leaflet or @react-google-maps/api

interface MapComponentProps {
  points: TaxFreePoint[];
}

function MapComponent({points}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    points.forEach((point) => {
      L.marker([point.position.lat, point.position.lng])
        .addTo(map)
        .bindPopup(`<b>${point.name}</b><br>${point.category}<br>${point.returnRate}% Return`);
    });

    // Return a cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [points]);
  return <div className="h-full w-full  sm:mx-auto" ref={mapRef} />;
}

export default MapComponent;

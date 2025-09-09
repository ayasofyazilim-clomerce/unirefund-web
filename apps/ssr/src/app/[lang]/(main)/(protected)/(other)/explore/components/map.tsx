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

    // Fix leaflet default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Calculate center based on points or default to Istanbul Airport
    let center: [number, number] = [41.2611789, 28.739211]; // Istanbul Airport default
    let zoom = 15;

    if (points.length > 0) {
      const lats = points.map((p) => p.position.lat);
      const lngs = points.map((p) => p.position.lng);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      center = [centerLat, centerLng];

      // Adjust zoom based on point spread
      const latSpread = Math.max(...lats) - Math.min(...lats);
      const lngSpread = Math.max(...lngs) - Math.min(...lngs);
      const maxSpread = Math.max(latSpread, lngSpread);

      if (maxSpread > 0.1) zoom = 10;
      else if (maxSpread > 0.05) zoom = 12;
      else if (maxSpread > 0.01) zoom = 14;
      else zoom = 16;
    }

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers for each point
    points.forEach((point) => {
      const marker = L.marker([point.position.lat, point.position.lng]).addTo(map).bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${point.name}</h3>
            <p style="margin: 4px 0; color: #666;">${point.category}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #888;">${point.address}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="color: #f59e0b;">★ ${point.rating}</span>
              <span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                ${point.returnRate}% Return
              </span>
            </div>
          </div>
        `);
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

"use client";
import {embedDashboard} from "@superset-ui/embedded-sdk";
import {useEffect} from "react";

export default function Dashboard({supersetUrl, dashboardId}: {supersetUrl: string; dashboardId: string}) {
  useEffect(() => {
    const mountPoint = document.getElementById("dashboard-embed");
    if (mountPoint) {
      void embedDashboard({
        id: dashboardId,
        supersetDomain: supersetUrl,
        mountPoint,
        fetchGuestToken: () => getToken(dashboardId),
        dashboardUiConfig: {
          filters: {
            expanded: true,
          },
          urlParams: {
            standalone: 3,
          },
        },
      });
    }
  }, []);
  return <div className="mb-4 size-full [&>iframe]:size-full" id="dashboard-embed" />;
}

async function getToken(dashboardId: string) {
  const x = (await fetch(`/api/token/?dashboardId=${dashboardId}`)).text();
  return x;
}

"use client";
import {embedDashboard} from "@superset-ui/embedded-sdk";
import {useEffect} from "react";

const supersetUrl = "http://192.168.1.107:8089";
const dashboardId = "58a2e4b8-a0da-4e73-9f98-d8946fc908f7"; // replace with your dashboard id

export default function Dashboard() {
  useEffect(() => {
    const mountPoint = document.getElementById("dashboard-embed");
    if (mountPoint) {
      void embedDashboard({
        id: dashboardId, // Use the id obtained from enabling embedding dashboard option
        supersetDomain: supersetUrl,
        mountPoint, // html element in which iframe will be mounted to show the dashboard
        fetchGuestToken: () => getToken(),
        dashboardUiConfig: {
          // hideTitle: true,
          // hideTab:true
          filters: {
            expanded: true,
          },
          urlParams: {
            standalone: 3, // here you can add the url_params and there values
          },
        },
      });
    }
  }, []);
  return <div className="mb-4 size-full [&>iframe]:size-full" id="dashboard-embed" />;
}

async function getToken() {
  // This uses admin creds to fetch the token
  const x = (await fetch(`/api/token/?dashboardId=${dashboardId}`)).text();
  return x;
}

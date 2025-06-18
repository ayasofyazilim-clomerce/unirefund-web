import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./dashboard"), {
  ssr: false,
});

export default function Page() {
  const supersetUrl = process.env.SUPERSET_URL;
  const dashboardId = process.env.SUPERSET_DASHBOARD_ID;
  if (!supersetUrl || !dashboardId) return <div>Error: Superset URL or Dashboard ID is not configured.</div>;
  return (
    <div className="h-full w-full">
      <Dashboard dashboardId={dashboardId} supersetUrl={supersetUrl} />
    </div>
  );
}

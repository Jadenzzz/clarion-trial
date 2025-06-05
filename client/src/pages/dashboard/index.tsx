import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Assistants from "./Assistants";
import CallsTable from "./CallsTable";
import {
  BotIcon,
  Clock,
  Phone,
  PhoneCallIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stats } from "@/public /types/call";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/components_basic/Loader";
import { Toaster } from "react-hot-toast";
import { formatDuration } from "@/utils";

const TABS = [
  {
    label: "Assistants",
    value: "assistants",
    component: <Assistants />,
    icon: <BotIcon className="w-4 h-4" />,
  },
  {
    label: "Calls",
    value: "calls",
    component: <CallsTable />,
    icon: <PhoneCallIcon className="w-4 h-4" />,
  },
];

const getStats = async (): Promise<Stats> => {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/calls/stats");
  return res.json();
};

function DashboardPage() {
  const { data: stats, isLoading: is_loading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  // Calculate stats constants
  const total_calls_change = stats?.yesterday_total_count
    ? stats?.yesterday_total_count - stats?.total_count
    : 0;

  const success_rate_change = stats?.yesterday_success_rate
    ? stats?.yesterday_success_rate - stats?.success_rate
    : 0;

  const avg_duration_formatted = formatDuration(stats?.avg_duration);

  const avg_duration_change =
    stats?.yesterday_avg_duration && stats?.avg_duration
      ? (() => {
          const diff = stats.yesterday_avg_duration - stats.avg_duration;
          const minutes = Math.floor(Math.abs(diff) / 60);
          const seconds = Math.abs(diff) % 60;
          const sign = diff > 0 ? "+" : "";
          return minutes > 0
            ? `${sign}${Math.floor(diff / 60)}m ${seconds}s`
            : `${sign}${Math.floor(diff)}s`;
        })()
      : "0s";

  if (is_loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto overflow-auto mt-10">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row w-full justify-between gap-2">
          <h1 className="text-2xl font-bold">AI Calls Agent Reports</h1>
        </div>
        <h2 className="text-sm text-gray-500">
          Monitor and manage all calls made to your AI assistants with detailed
          analytics and insights.
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {total_calls_change}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.success_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {success_rate_change}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avg_duration_formatted}</div>
            <p className="text-xs text-muted-foreground">
              {avg_duration_change} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assistants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assistant_count}</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={TABS[0].value} className="w-full">
        <TabsList className="w-full mt-2 mb-2">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}

export default DashboardPage;

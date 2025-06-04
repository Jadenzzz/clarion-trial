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
function DashboardPage() {
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
            <div className="text-2xl font-bold">178</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 18s</div>
            <p className="text-xs text-muted-foreground">-5s from last month</p>
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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={TABS[0].value} className="w-full">
        <TabsList className="w-full mt-2 mb-2">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
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
    </div>
  );
}

export default DashboardPage;

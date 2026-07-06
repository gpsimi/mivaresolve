import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare, AlertCircle, Calendar, ClipboardList } from "lucide-react";

export default function OfficerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Technician Workspace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your assigned tasks and update maintenance resolution progress.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Assigned Tasks
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total assigned to you</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Actions
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Awaiting status update</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              In Progress
            </CardTitle>
            <Calendar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Active repairs</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Completed Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Resolved this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks Area */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Recent Task Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          You don't have any assigned tasks currently.
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Admin Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome to the MivaResolve operations control center.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Complaints
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Submitted requests</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Assignment
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Requires action</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Officers
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">On-duty technicians</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved Issues
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Closed tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Recent Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
            No complaints logged yet.
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Maintenance Officers
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
            No active officers registered.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info, Clock, CheckCircle2, ShieldAlert } from "lucide-react";

export default function RequesterDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Student & Staff Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit new maintenance complaints and track their status in real-time.
          </p>
        </div>
        <Link href="/dashboard/requester/submit">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow">
            <PlusCircle className="mr-2 h-4 w-4" />
            Report a Fault
          </Button>
        </Link>
      </div>

      {/* Info Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Submitted Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Pending approval or assignment</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              In Progress
            </CardTitle>
            <Info className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Technicians working on site</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved Repairs
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">0</div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Verified resolved issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Track Grid Area */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Your Reported Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
          <ShieldAlert size={40} className="text-slate-300 dark:text-slate-700" />
          <p className="text-sm">You have not submitted any complaints yet.</p>
          <Link href="/dashboard/requester/submit" className="text-xs text-blue-900 hover:underline dark:text-blue-400 font-semibold">
            Click here to submit your first report
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

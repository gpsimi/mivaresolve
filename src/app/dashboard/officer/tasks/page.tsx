"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckSquare, 
  Clock, 
  Wrench, 
  ArrowRight,
  ClipboardList,
  AlertCircle,
  FileText
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  category: {
    name: string;
  };
  requester: {
    name: string;
    email: string;
  };
}

export default function OfficerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update Status Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/officer/tasks");
      if (!response.ok) {
        throw new Error("Failed to load your assigned tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newStatus) return;

    setUpdateLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/officer/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedTask.id,
          status: newStatus,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task status");
      }

      // Reset state and reload
      setSelectedTask(null);
      setNewStatus("");
      setComment("");
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450">
            Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400">
            In Progress
          </span>
        );
      case "ASSIGNED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400">
            Assigned
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Assigned Tasks Board
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all maintenance complaints assigned to you, edit their work progress, and log resolutions.
        </p>
      </div>

      {/* Tasks Database */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching assigned tasks...</p>
        </div>
      ) : error && !selectedTask ? (
        <div className="p-4 rounded-md bg-red-50 text-sm text-red-600 border border-red-150 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-455 dark:text-slate-500">
            <ClipboardList size={48} className="text-slate-300 dark:text-slate-800 mb-3 shrink-0" />
            <p className="font-semibold text-slate-700 dark:text-slate-350">No assigned tasks</p>
            <p className="text-sm text-slate-450 dark:text-slate-500 text-center max-w-sm mt-1">
              You are currently caught up with all campus requests. Enjoy your day!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-slate-200/60 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-750 transition-colors shadow-sm">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold dark:bg-slate-800 dark:text-slate-400 border border-slate-200/30">
                      {task.category.name}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-550 dark:text-slate-400 line-clamp-1">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 pt-1 font-medium">
                    <span className="flex items-center">
                      Reported by {task.requester.name} ({task.requester.email})
                    </span>
                    <span>•</span>
                    <span>
                      Assigned on {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0 gap-2">
                  <Link href={`/dashboard/requester/requests/${task.id}`}>
                    <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-850 h-9">
                      Inspect Details
                    </Button>
                  </Link>
                  {task.status !== "RESOLVED" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setNewStatus(task.status === "ASSIGNED" ? "IN_PROGRESS" : "RESOLVED");
                      }}
                      className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow h-9 font-semibold"
                    >
                      <Wrench size={14} className="mr-1.5" />
                      Update Task
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Task status update modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-slate-200 dark:border-slate-850 shadow-xl z-55 animate-in fade-in-50 zoom-in-95 duration-150">
            <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-4">
              <CardTitle className="text-base font-bold text-slate-850 dark:text-slate-100">
                Update Task Work Progress
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdateStatus}>
              <CardContent className="pt-5 space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-md bg-red-50 p-2.5 text-xs text-red-650 border border-red-100 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                    Complaint
                  </p>
                  <p className="text-sm font-semibold text-slate-805 dark:text-slate-200">
                    {selectedTask.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="statusSelect" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Next status
                  </label>
                  <select
                    id="statusSelect"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-slate-250 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-250"
                  >
                    <option value="IN_PROGRESS" className="dark:bg-slate-900">In Progress (Active repair)</option>
                    <option value="RESOLVED" className="dark:bg-slate-900">Resolved (Work completed)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="commentArea" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Progress Note / Comment
                  </label>
                  <Textarea
                    id="commentArea"
                    placeholder="Enter details of work done, resources required, or resolution summary..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full border-slate-200 dark:border-slate-750 resize-none text-sm"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end space-x-3 p-4 border-t border-slate-100 dark:border-slate-850 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedTask(null);
                    setComment("");
                  }}
                  disabled={updateLoading}
                  className="border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-semibold"
                >
                  {updateLoading ? "Saving..." : "Save Progress"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

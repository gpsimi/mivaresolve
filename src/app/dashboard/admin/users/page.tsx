"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: {
    name: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to load users database");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "ADMINISTRATOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-750 border border-red-100 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
            <Shield size={12} />
            Administrator
          </span>
        );
      case "MAINTENANCE_OFFICER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400">
            <User size={12} />
            Technician
          </span>
        );
      case "STUDENT_STAFF":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/40 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50">
            <User size={12} />
            Student / Staff
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          User Management Database
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all registered campus accounts and inspect their access roles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-750"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching user directory...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-red-50 text-sm text-red-600 border border-red-150 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-450 dark:text-slate-500">
            <p className="font-semibold text-slate-700 dark:text-slate-350">No matching accounts found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-850">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-sm text-slate-700 dark:text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-850 dark:text-slate-200">
                      {u.name}
                    </td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">{getRoleBadge(u.role.name)}</td>
                    <td className="py-4 px-6 text-right text-slate-450 dark:text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

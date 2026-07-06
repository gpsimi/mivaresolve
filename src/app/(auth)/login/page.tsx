"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <Card className="w-full max-w-md border-slate-200/80 shadow-lg dark:border-slate-800">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-1">
            <span className="text-2xl font-black tracking-wider text-blue-900 dark:text-blue-400">
              MIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
            </span>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Enter your credentials to access your maintenance portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@miva.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border-slate-200 dark:border-slate-700"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium shadow dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4 text-sm text-slate-500 dark:text-slate-400">
          New student?{" "}
          <Link
            href="/register"
            className="ml-1 font-semibold text-blue-900 hover:underline dark:text-blue-400"
          >
            Register here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
        Loading Login Portal...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

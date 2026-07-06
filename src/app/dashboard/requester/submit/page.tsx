"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle, FileImage } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function SubmitRequestPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to load request categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Could not fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed as evidence");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // 3. Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!categoryId) {
      setError("Please select a valid category");
      return;
    }

    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSuccess("Complaint logged successfully! Redirecting to tracker...");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        router.push("/dashboard/requester/requests");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Report a Fault
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Submit details of maintenance issues or complaints. Upload images for clear evidence.
        </p>
      </div>

      <Card className="border-slate-200/80 shadow-md dark:border-slate-850">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-100 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400">
                {success}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-medium">
                Issue Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Leaking pipe in Hostel Block B, Room 102"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={submitLoading}
                className="w-full border-slate-200 dark:border-slate-750"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 dark:text-slate-300 font-medium">
                Category
              </Label>
              {categoriesLoading ? (
                <div className="text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                  Loading categories from database...
                </div>
              ) : (
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={submitLoading}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="" className="text-slate-400 dark:bg-slate-900">
                    -- Select Issue Category --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium">
                Description of the Fault
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe the issue in detail. State exact location, severity, and any hazards if applicable."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                disabled={submitLoading}
                className="w-full border-slate-200 dark:border-slate-750 resize-y"
              />
            </div>

            {/* Photo upload section */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">
                Photo Evidence (Optional, max 5MB)
              </Label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Upload size={32} className="text-slate-400 group-hover:text-slate-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Click to select an image
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    PNG, JPG, or WEBP (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative border border-slate-200 rounded-lg p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Evidence preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {imageFile?.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {(imageFile!.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={removeImage}
                    disabled={submitLoading}
                    className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                  >
                    <X size={18} />
                  </Button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-150 dark:border-slate-850">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitLoading}
                className="border-slate-250 dark:border-slate-750 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitLoading}
                className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow font-medium"
              >
                {submitLoading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

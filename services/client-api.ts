import { createClient } from "@/lib/supabase/client";

// Create a wrapper for authenticated API calls
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add any existing headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication required");
    }
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Story API
export const StoryAPI = {
  getUserStories: () => authenticatedFetch("/api/user/stories"),

  saveStory: (storyData: any) =>
    authenticatedFetch("/api/stories/save", {
      method: "POST",
      body: JSON.stringify(storyData),
    }),

  toggleFavorite: (storyId: string, isFavorite: boolean) =>
    authenticatedFetch("/api/user/stories/favorite", {
      method: "POST",
      body: JSON.stringify({ storyId, isFavorite }),
    }),

  deleteStory: (storyId: string) =>
    authenticatedFetch(`/api/user/stories?id=${storyId}`, {
      method: "DELETE",
    }),

  shareStory: (storyId: string) =>
    authenticatedFetch("/api/user/stories/share", {
      method: "POST",
      body: JSON.stringify({ storyId }),
    }),

  downloadStory: (storyId: string) =>
    authenticatedFetch(`/api/user/stories/download?id=${storyId}`),
};

// Collection API
export const CollectionAPI = {
  getUserCollections: () => authenticatedFetch("/api/user/collections"),

  createCollection: (collectionData: any) =>
    authenticatedFetch("/api/user/collections", {
      method: "POST",
      body: JSON.stringify(collectionData),
    }),

  updateCollection: (collectionId: string, updateData: any) =>
    authenticatedFetch("/api/user/collections", {
      method: "PUT",
      body: JSON.stringify({ collectionId, ...updateData }),
    }),

  deleteCollection: (collectionId: string) =>
    authenticatedFetch(`/api/user/collections?id=${collectionId}`, {
      method: "DELETE",
    }),

  shareCollection: (collectionId: string) =>
    authenticatedFetch("/api/user/collections/share", {
      method: "POST",
      body: JSON.stringify({ collectionId }),
    }),
};

// User API
export const UserAPI = {
  getProfile: () => authenticatedFetch("/api/user/profile"),

  updateProfile: (profile: any, preferences?: any) =>
    authenticatedFetch("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ profile, preferences }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    authenticatedFetch("/api/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  exportData: () => authenticatedFetch("/api/user/export"),

  deleteAccount: () =>
    authenticatedFetch("/api/user/account", {
      method: "DELETE",
    }),
};

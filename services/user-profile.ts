import { ApiClient } from "@/utils/api-client";

export interface UserProfile {
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  story_count: number;
  collection_count: number;
  total_reads: number;
}

export interface UserPreferences {
  default_art_style: string;
  default_story_length: string;
  default_theme: string;
  language: string;
  auto_save: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  data_collection: boolean;
  public_profile: boolean;
  show_reading_progress: boolean;
  dark_mode: string;
}

export interface StorageData {
  used_storage: number;
  total_storage: number;
  story_files: number;
  image_files: number;
}

export class UserProfileService {
  static async getUserProfile(): Promise<{
    profile: UserProfile;
    preferences: UserPreferences;
  }> {
    return ApiClient.get("/api/user/profile");
  }

  static async updateProfile(
    profile: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const response = await ApiClient.put("/api/user/profile", { profile });
    return response.profile;
  }

  static async updatePreferences(
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    const response = await ApiClient.put("/api/user/profile", { preferences });
    return response.preferences;
  }

  static async getStorageData(): Promise<StorageData> {
    return ApiClient.get("/api/user/storage");
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return ApiClient.put("/api/user/password", {
      currentPassword,
      newPassword,
    });
  }

  static async exportUserData(): Promise<void> {
    try {
      // Get the data from the API
      const response = await ApiClient.get("/api/user/export");

      // Create a blob from the JSON data
      const jsonData = JSON.stringify(response, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `user-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting user data:", error);
      throw error;
    }
  }

  static async deleteAccount(): Promise<void> {
    try {
      await ApiClient.delete("/api/user/account");

      // Sign out the user after successful account deletion
      const { supabase } = await import("../lib/supabase");
      await supabase.auth.signOut();

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
}

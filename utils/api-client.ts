import { createClient } from "@/lib/supabase/client";

export class ApiClient {
  private static async getAuthHeaders(): Promise<HeadersInit> {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  static async get(url: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Auth error - don't log as error, just throw
          throw new Error("Authentication required");
        }
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Request failed");
      }

      return response.json();
    } catch (error) {
      console.error("API GET error:", error);
      throw error;
    }
  }

  static async post(url: string, data: any): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Request failed");
      }

      return response.json();
    } catch (error) {
      console.error("API POST error:", error);
      throw error;
    }
  }

  static async put(url: string, data: any): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Request failed");
      }

      return response.json();
    } catch (error) {
      console.error("API PUT error:", error);
      throw error;
    }
  }

  static async delete(url: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Request failed");
      }

      return response.json();
    } catch (error) {
      console.error("API DELETE error:", error);
      throw error;
    }
  }
}

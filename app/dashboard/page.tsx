"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { BookOpen, Plus, Heart, Folder, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserStoryService } from "@/services/user-story";
import { UserCollectionService } from "@/services/user-collection";

interface DashboardData {
  user: any;
  preferences: any;
  recentStories: any[];
  favoriteStories: any[];
  collections: any[];
  stats: {
    totalStories: number;
    favoriteCount: number;
    collectionCount: number;
  };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (loading || !user) {
        return; // Wait for authentication to be ready
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load user stories and collections in parallel
        const [userStories, userCollections] = await Promise.all([
          UserStoryService.getUserStories(),
          UserCollectionService.getUserCollections(),
        ]);

        if (!userStories || !userCollections) {
          throw new Error("Failed to load dashboard data");
        }

        // Process recent stories (last 5)
        const recentStories = userStories
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5)
          .map((story: any) => ({
            id: story.id,
            title: story.title,
            pageCount: story.page_count || 0,
            createdAt: story.created_at,
            isFavorite: story.is_favorite || false,
          }));

        // Process favorite stories
        const favoriteStories = userStories.filter(
          (story: any) => story.is_favorite,
        );

        // Process collections with story counts
        const collections = userCollections.map((collection: any) => ({
          id: collection.id,
          name: collection.name,
          storyCount: collection.story_count || 0,
          color: "#6366f1", // Default color - you can enhance this later
        }));

        const dashboardData: DashboardData = {
          user: user,
          preferences: {}, // This can be loaded from user preferences API
          recentStories,
          favoriteStories,
          collections,
          stats: {
            totalStories: userStories.length,
            favoriteCount: favoriteStories.length,
            collectionCount: userCollections.length,
          },
        };

        setDashboardData(dashboardData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data");
        // Set default empty data on error
        setDashboardData({
          user: user,
          preferences: {},
          recentStories: [],
          favoriteStories: [],
          collections: [],
          stats: {
            totalStories: 0,
            favoriteCount: 0,
            collectionCount: 0,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, loading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user?.user_metadata?.full_name || "Storyteller"}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to create more magical stories?
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-4">
          <Link href="/create">
            <Button
              color="primary"
              size="lg"
              startContent={<Plus className="h-5 w-5" />}
            >
              Create New Story
            </Button>
          </Link>
          <Link href="/library">
            <Button
              variant="bordered"
              size="lg"
              startContent={<BookOpen className="h-5 w-5" />}
            >
              My Library
            </Button>
          </Link>
          <Link href="/collections">
            <Button
              variant="bordered"
              size="lg"
              startContent={<Folder className="h-5 w-5" />}
            >
              Collections
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="bordered"
              size="lg"
              startContent={<Settings className="h-5 w-5" />}
            >
              Settings
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        <Card>
          <CardBody className="p-6 text-center">
            <div className="text-primary mb-2 text-3xl font-bold">
              {dashboardData?.stats.totalStories || 0}
            </div>
            <div className="text-muted-foreground">Total Stories</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="text-accent mb-2 text-3xl font-bold">
              {dashboardData?.stats.favoriteCount || 0}
            </div>
            <div className="text-muted-foreground">Favorites</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 text-center">
            <div className="text-primary mb-2 text-3xl font-bold">
              {dashboardData?.stats.collectionCount || 0}
            </div>
            <div className="text-muted-foreground">Collections</div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Stories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardBody className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Stories</h2>
                <Link href="/library">
                  <Button variant="light" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {dashboardData?.recentStories.length ? (
                <div className="space-y-3">
                  {dashboardData?.recentStories.slice(0, 3).map((story) => (
                    <div
                      key={story.id}
                      className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-3 transition-colors"
                    >
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        <BookOpen className="text-primary h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{story.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {story.pageCount} pages •{" "}
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {story.isFavorite && (
                        <Heart className="text-danger h-4 w-4 fill-current" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No stories yet. Create your first story!</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Collections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardBody className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Collections</h2>
                <Link href="/collections">
                  <Button variant="light" size="sm">
                    Manage
                  </Button>
                </Link>
              </div>

              {dashboardData?.collections.length ? (
                <div className="space-y-3">
                  {dashboardData?.collections.slice(0, 3).map((collection) => (
                    <div
                      key={collection.id}
                      className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-3 transition-colors"
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${collection.color}20` }}
                      >
                        <Folder
                          className="h-6 w-6"
                          style={{ color: collection.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {collection.storyCount || 0} stories
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Folder className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No collections yet. Organize your stories!</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Quick Start Guide for New Users */}
      {dashboardData?.stats.totalStories === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="from-primary/10 to-secondary/10 border-primary/20 bg-gradient-to-r">
            <CardBody className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">
                Welcome to StorySprout! 🌟
              </h2>
              <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
                You're just moments away from creating your first magical story.
                Our AI will help you craft a personalized tale that your child
                will treasure forever.
              </p>
              <Link href="/create">
                <Button
                  color="primary"
                  size="lg"
                  startContent={<Plus className="h-5 w-5" />}
                >
                  Create Your First Story
                </Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

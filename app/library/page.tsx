"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Spinner,
} from "@heroui/react";
import {
  BookOpen,
  Search,
  Grid3X3,
  List,
  Heart,
  Share2,
  Download,
  Trash2,
  Eye,
  Calendar,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserStoryService, type UserStory } from "@/services";

interface Story {
  id: string;
  title: string;
  summary: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  art_style: string;
  main_character: string;
  setting: string;
  theme: string;
  story_length: string;
  child_name: string;
  child_age: number;
  page_count: number;
  view_count: number;
  is_shared: boolean;
}

interface LibraryFilters {
  search: string;
  artStyle: string;
  storyLength: string;
  theme: string;
  sortBy: string;
  viewMode: "grid" | "list";
}

export default function LibraryPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LibraryFilters>({
    search: "",
    artStyle: "",
    storyLength: "",
    theme: "",
    sortBy: "recent",
    viewMode: "grid",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const storiesPerPage = 12;

  useEffect(() => {
    if (user) {
      loadUserStories();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [stories, filters]);

  const loadUserStories = async () => {
    try {
      setIsLoading(true);
      const userStories = await UserStoryService.getUserStories();
      setStories(userStories);
    } catch (error) {
      console.error("Failed to load stories:", error);
      // Set empty array on error instead of mock data
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...stories];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          story.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
          story.main_character
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // Art style filter
    if (filters.artStyle) {
      filtered = filtered.filter(
        (story) => story.art_style === filters.artStyle,
      );
    }

    // Story length filter
    if (filters.storyLength) {
      filtered = filtered.filter(
        (story) => story.story_length === filters.storyLength,
      );
    }

    // Theme filter
    if (filters.theme) {
      filtered = filtered.filter((story) => story.theme === filters.theme);
    }

    // Sort
    switch (filters.sortBy) {
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "popular":
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case "favorites":
        filtered.sort(
          (a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0),
        );
        break;
    }

    setFilteredStories(filtered);
    setCurrentPage(1);
  };

  const toggleFavorite = async (storyId: string) => {
    try {
      await UserStoryService.toggleFavorite(storyId);
      setStories((prev) =>
        prev.map((story) =>
          story.id === storyId
            ? { ...story, is_favorite: !story.is_favorite }
            : story,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      await UserStoryService.deleteStory(storyId);
      setStories((prev) => prev.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const shareStory = async (storyId: string) => {
    try {
      await UserStoryService.shareStory(storyId);
    } catch (error) {
      console.error("Failed to share story:", error);
    }
  };

  const downloadStory = async (storyId: string) => {
    try {
      await UserStoryService.downloadStory(storyId);
    } catch (error) {
      console.error("Failed to download story:", error);
    }
  };

  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage,
  );

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="bg-content1 mb-8 rounded-xl border p-6 backdrop-blur-sm">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search stories..."
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                isClearable
                onClear={() => setFilters((prev) => ({ ...prev, search: "" }))}
              />
            </div>

            <Select
              placeholder="Art Style"
              selectedKeys={filters.artStyle ? [filters.artStyle] : []}
              onSelectionChange={(keys) =>
                setFilters((prev) => ({
                  ...prev,
                  artStyle: (Array.from(keys)[0] as string) || "",
                }))
              }
            >
              <SelectItem key="cartoon">Cartoon</SelectItem>
              <SelectItem key="watercolor">Watercolor</SelectItem>
              <SelectItem key="digital">Digital</SelectItem>
              <SelectItem key="realistic">Realistic</SelectItem>
              <SelectItem key="fantasy">Fantasy</SelectItem>
            </Select>

            <Select
              placeholder="Length"
              selectedKeys={filters.storyLength ? [filters.storyLength] : []}
              onSelectionChange={(keys) =>
                setFilters((prev) => ({
                  ...prev,
                  storyLength: (Array.from(keys)[0] as string) || "",
                }))
              }
            >
              <SelectItem key="short">Short (5-8 pages)</SelectItem>
              <SelectItem key="medium">Medium (9-12 pages)</SelectItem>
              <SelectItem key="long">Long (13+ pages)</SelectItem>
            </Select>

            <Select
              placeholder="Sort by"
              selectedKeys={[filters.sortBy]}
              onSelectionChange={(keys) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: Array.from(keys)[0] as string,
                }))
              }
            >
              <SelectItem key="recent">Most Recent</SelectItem>
              <SelectItem key="oldest">Oldest First</SelectItem>
              <SelectItem key="title">Title A-Z</SelectItem>
              <SelectItem key="popular">Most Viewed</SelectItem>
              <SelectItem key="favorites">Favorites First</SelectItem>
            </Select>

            <div className="flex space-x-2">
              <Button
                isIconOnly
                variant={filters.viewMode === "grid" ? "solid" : "ghost"}
                color="primary"
                onPress={() =>
                  setFilters((prev) => ({ ...prev, viewMode: "grid" }))
                }
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                variant={filters.viewMode === "list" ? "solid" : "ghost"}
                color="primary"
                onPress={() =>
                  setFilters((prev) => ({ ...prev, viewMode: "list" }))
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredStories.length} stories found
              </span>
              {(filters.search ||
                filters.artStyle ||
                filters.storyLength ||
                filters.theme) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      search: "",
                      artStyle: "",
                      storyLength: "",
                      theme: "",
                    }))
                  }
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stories Grid/List */}
        {filteredStories.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No stories found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {stories.length === 0
                ? "You haven't created any stories yet."
                : "Try adjusting your filters to find more stories."}
            </p>
            <Button
              as={Link}
              href="/create"
              color="primary"
              startContent={<BookOpen className="h-4 w-4" />}
            >
              Create Your First Story
            </Button>
          </div>
        ) : (
          <>
            {filters.viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedStories.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/story/${story.id}`} className="block h-full">
                      <Card className="h-full cursor-pointer transition-shadow duration-200 hover:shadow-lg">
                        <CardHeader className="p-0">
                          <div className="relative">
                            <img
                              src={story.thumbnail || "/placeholder.jpg"}
                              alt={story.title}
                              className="h-48 w-full rounded-t-lg object-cover"
                            />
                            <div
                              className="absolute top-2 right-2 z-10 flex space-x-1"
                              onClick={(e) => e.preventDefault()} // Prevent link navigation for action buttons
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                variant="solid"
                                color={story.is_favorite ? "danger" : "default"}
                                className="bg-white/80 backdrop-blur-sm"
                                onPress={() => toggleFavorite(story.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    story.is_favorite ? "fill-current" : ""
                                  }`}
                                />
                              </Button>
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="solid"
                                    className="bg-white/80 backdrop-blur-sm"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                  <DropdownItem
                                    key="read"
                                    startContent={
                                      <BookOpen className="h-4 w-4" />
                                    }
                                    as={Link}
                                    href={`/story/${story.id}`}
                                  >
                                    Read Story
                                  </DropdownItem>
                                  <DropdownItem
                                    key="view"
                                    startContent={<Eye className="h-4 w-4" />}
                                    onPress={() => {
                                      setSelectedStory(story);
                                      onOpen();
                                    }}
                                  >
                                    View Details
                                  </DropdownItem>
                                  <DropdownItem
                                    key="share"
                                    startContent={
                                      <Share2 className="h-4 w-4" />
                                    }
                                    onPress={() => shareStory(story.id)}
                                  >
                                    Share
                                  </DropdownItem>
                                  <DropdownItem
                                    key="download"
                                    startContent={
                                      <Download className="h-4 w-4" />
                                    }
                                    onPress={() => downloadStory(story.id)}
                                  >
                                    Download PDF
                                  </DropdownItem>
                                  <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                      <Trash2 className="h-4 w-4" />
                                    }
                                    onPress={() => deleteStory(story.id)}
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                            {story.is_shared && (
                              <div className="absolute bottom-2 left-2">
                                <Chip size="sm" color="success" variant="solid">
                                  Shared
                                </Chip>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardBody className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                                {story.title}
                              </h3>
                              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                {story.summary}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <Chip size="sm" variant="flat" color="primary">
                                {story.art_style}
                              </Chip>
                              <Chip size="sm" variant="flat" color="secondary">
                                {story.story_length}
                              </Chip>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    story.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{story.view_count} views</span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedStories.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardBody>
                        <div className="flex items-center space-x-4">
                          <img
                            src={story.thumbnail || "/placeholder.jpg"}
                            alt={story.title}
                            className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {story.title}
                                </h3>
                                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                  {story.summary}
                                </p>
                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                  <span>
                                    For {story.child_name}, age{" "}
                                    {story.child_age}
                                  </span>
                                  <span>{story.page_count} pages</span>
                                  <span>{story.view_count} views</span>
                                  <span>
                                    {new Date(
                                      story.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 flex items-center space-x-2">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="ghost"
                                  color={
                                    story.is_favorite ? "danger" : "default"
                                  }
                                  onPress={() => toggleFavorite(story.id)}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      story.is_favorite ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="ghost"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu>
                                    <DropdownItem
                                      key="read"
                                      startContent={
                                        <BookOpen className="h-4 w-4" />
                                      }
                                      as={Link}
                                      href={`/story/${story.id}`}
                                    >
                                      Read Story
                                    </DropdownItem>
                                    <DropdownItem
                                      key="view"
                                      startContent={<Eye className="h-4 w-4" />}
                                      onPress={() => {
                                        setSelectedStory(story);
                                        onOpen();
                                      }}
                                    >
                                      View Details
                                    </DropdownItem>
                                    <DropdownItem
                                      key="share"
                                      startContent={
                                        <Share2 className="h-4 w-4" />
                                      }
                                      onPress={() => shareStory(story.id)}
                                    >
                                      Share
                                    </DropdownItem>
                                    <DropdownItem
                                      key="download"
                                      startContent={
                                        <Download className="h-4 w-4" />
                                      }
                                      onPress={() => downloadStory(story.id)}
                                    >
                                      Download PDF
                                    </DropdownItem>
                                    <DropdownItem
                                      key="delete"
                                      className="text-danger"
                                      color="danger"
                                      startContent={
                                        <Trash2 className="h-4 w-4" />
                                      }
                                      onPress={() => deleteStory(story.id)}
                                    >
                                      Delete
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  showShadow
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Story Details Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedStory?.title}
              </ModalHeader>
              <ModalBody>
                {selectedStory && (
                  <div className="space-y-4">
                    <img
                      src={selectedStory.thumbnail || "/placeholder.jpg"}
                      alt={selectedStory.title}
                      className="h-64 w-full rounded-lg object-cover"
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Created for:</span>
                        <p>
                          {selectedStory.child_name}, age{" "}
                          {selectedStory.child_age}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Pages:</span>
                        <p>{selectedStory.page_count}</p>
                      </div>
                      <div>
                        <span className="font-medium">Art Style:</span>
                        <p className="capitalize">{selectedStory.art_style}</p>
                      </div>
                      <div>
                        <span className="font-medium">Length:</span>
                        <p className="capitalize">
                          {selectedStory.story_length}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Main Character:</span>
                        <p>{selectedStory.main_character}</p>
                      </div>
                      <div>
                        <span className="font-medium">Setting:</span>
                        <p>{selectedStory.setting}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Theme:</span>
                        <p>{selectedStory.theme}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Summary:</span>
                        <p>{selectedStory.summary}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        as={Link}
                        href={`/story/${selectedStory.id}`}
                        color="primary"
                        startContent={<Eye className="h-4 w-4" />}
                      >
                        Read Story
                      </Button>
                      <Button
                        variant="bordered"
                        startContent={<Download className="h-4 w-4" />}
                        onPress={() => downloadStory(selectedStory.id)}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="bordered"
                        startContent={<Share2 className="h-4 w-4" />}
                        onPress={() => shareStory(selectedStory.id)}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

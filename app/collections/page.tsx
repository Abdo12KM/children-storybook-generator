"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Checkbox,
} from "@heroui/react";
import {
  FolderOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Share2,
  BookOpen,
  MoreVertical,
  Lock,
  Globe,
  Calendar,
  Grid3X3,
  List,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCollectionService, type NewCollection } from "@/services";

interface Collection {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  story_count: number;
  stories: CollectionStory[];
  thumbnail?: string;
  tags: string[];
}

interface CollectionStory {
  id: string;
  title: string;
  thumbnail?: string;
  created_at: string;
  art_style: string;
  story_length: string;
}

export default function CollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [newCollection, setNewCollection] = useState<NewCollection>({
    name: "",
    description: "",
    is_public: false,
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();

  useEffect(() => {
    if (user) {
      loadCollections();
    }
  }, [user]);

  useEffect(() => {
    filterCollections();
  }, [collections, searchQuery]);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const userCollections = await UserCollectionService.getUserCollections();
      setCollections(userCollections);
    } catch (error) {
      console.error("Failed to load collections:", error);
      // Set empty array on error
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCollections = () => {
    let filtered = [...collections];

    if (searchQuery) {
      filtered = filtered.filter(
        (collection) =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          collection.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredCollections(filtered);
  };

  const createCollection = async () => {
    try {
      const collection =
        await UserCollectionService.createCollection(newCollection);
      setCollections((prev) => [collection, ...prev]);
      setNewCollection({
        name: "",
        description: "",
        is_public: false,
        tags: [],
      });
      onCreateOpenChange();
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  const updateCollection = async () => {
    if (!editingCollection) return;

    try {
      const updatedCollection = await UserCollectionService.updateCollection(
        editingCollection.id,
        {
          name: editingCollection.name,
          description: editingCollection.description,
          is_public: editingCollection.is_public,
          tags: editingCollection.tags,
        },
      );
      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === editingCollection.id
            ? updatedCollection
            : collection,
        ),
      );
      setEditingCollection(null);
      onEditOpenChange();
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      await UserCollectionService.deleteCollection(collectionId);
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  const shareCollection = async (collectionId: string) => {
    try {
      await UserCollectionService.shareCollection(collectionId);
    } catch (error) {
      console.error("Failed to share collection:", error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newCollection.tags.includes(newTag.trim())) {
      setNewCollection((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewCollection((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addEditingTag = () => {
    if (
      newTag.trim() &&
      editingCollection &&
      !editingCollection.tags.includes(newTag.trim())
    ) {
      setEditingCollection((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, newTag.trim()],
            }
          : null,
      );
      setNewTag("");
    }
  };

  const removeEditingTag = (tagToRemove: string) => {
    setEditingCollection((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
          }
        : null,
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and View Controls */}
        <div className="bg-content1 mb-8 rounded-xl border p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="max-w-md flex-1">
              <Input
                placeholder="Search collections..."
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                isClearable
                onClear={() => setSearchQuery("")}
              />
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredCollections.length} collections
              </span>
              <div className="flex space-x-2">
                <Button
                  isIconOnly
                  variant={viewMode === "grid" ? "solid" : "ghost"}
                  color="primary"
                  onPress={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  isIconOnly
                  variant={viewMode === "list" ? "solid" : "ghost"}
                  color="primary"
                  onPress={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Grid/List */}
        {filteredCollections.length === 0 ? (
          <div className="py-12 text-center">
            <FolderOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No collections found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {collections.length === 0
                ? "Create your first collection to organize your stories."
                : "Try adjusting your search to find more collections."}
            </p>
            <Button
              color="primary"
              startContent={<Plus className="h-4 w-4" />}
              onPress={onCreateOpen}
            >
              Create Collection
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full cursor-pointer transition-shadow duration-200 hover:shadow-lg">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className="bg-content2 flex h-48 w-full items-center justify-center rounded-t-lg">
                            {collection.thumbnail ? (
                              <img
                                src={collection.thumbnail}
                                alt={collection.name}
                                className="h-full w-full rounded-t-lg object-cover"
                              />
                            ) : (
                              <FolderOpen className="h-16 w-16 text-purple-400" />
                            )}
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Chip
                              size="sm"
                              color={
                                collection.is_public ? "success" : "default"
                              }
                              variant="solid"
                              startContent={
                                collection.is_public ? (
                                  <Globe className="h-3 w-3" />
                                ) : (
                                  <Lock className="h-3 w-3" />
                                )
                              }
                            >
                              {collection.is_public ? "Public" : "Private"}
                            </Chip>
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
                                  key="view"
                                  startContent={
                                    <FolderOpen className="h-4 w-4" />
                                  }
                                  onPress={() => {
                                    setSelectedCollection(collection);
                                    onViewOpen();
                                  }}
                                >
                                  View Collection
                                </DropdownItem>
                                <DropdownItem
                                  key="edit"
                                  startContent={<Edit3 className="h-4 w-4" />}
                                  onPress={() => {
                                    setEditingCollection(collection);
                                    onEditOpen();
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  key="share"
                                  startContent={<Share2 className="h-4 w-4" />}
                                  onPress={() => shareCollection(collection.id)}
                                >
                                  Share
                                </DropdownItem>
                                <DropdownItem
                                  key="delete"
                                  className="text-danger"
                                  color="danger"
                                  startContent={<Trash2 className="h-4 w-4" />}
                                  onPress={() =>
                                    deleteCollection(collection.id)
                                  }
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody
                        className="flex-1"
                        onClick={() => {
                          setSelectedCollection(collection);
                          onViewOpen();
                        }}
                      >
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {collection.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {collection.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {collection.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                size="sm"
                                variant="flat"
                                color="primary"
                              >
                                {tag}
                              </Chip>
                            ))}
                            {collection.tags.length > 3 && (
                              <Chip size="sm" variant="flat" color="default">
                                +{collection.tags.length - 3}
                              </Chip>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{collection.story_count} stories</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  collection.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="transition-shadow duration-200 hover:shadow-md">
                      <CardBody>
                        <div className="flex items-center space-x-4">
                          <div className="bg-content2 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
                            <FolderOpen className="h-8 w-8 text-purple-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {collection.name}
                                  </h3>
                                  <Chip
                                    size="sm"
                                    color={
                                      collection.is_public
                                        ? "success"
                                        : "default"
                                    }
                                    variant="flat"
                                    startContent={
                                      collection.is_public ? (
                                        <Globe className="h-3 w-3" />
                                      ) : (
                                        <Lock className="h-3 w-3" />
                                      )
                                    }
                                  >
                                    {collection.is_public
                                      ? "Public"
                                      : "Private"}
                                  </Chip>
                                </div>
                                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                  {collection.description}
                                </p>
                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{collection.story_count} stories</span>
                                  <span>
                                    {new Date(
                                      collection.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>
                                    Updated{" "}
                                    {new Date(
                                      collection.updated_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {collection.tags.slice(0, 5).map((tag) => (
                                    <Chip
                                      key={tag}
                                      size="sm"
                                      variant="flat"
                                      color="primary"
                                    >
                                      {tag}
                                    </Chip>
                                  ))}
                                  {collection.tags.length > 5 && (
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      color="default"
                                    >
                                      +{collection.tags.length - 5}
                                    </Chip>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  startContent={
                                    <FolderOpen className="h-4 w-4" />
                                  }
                                  onPress={() => {
                                    setSelectedCollection(collection);
                                    onViewOpen();
                                  }}
                                >
                                  View
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
                                      key="edit"
                                      startContent={
                                        <Edit3 className="h-4 w-4" />
                                      }
                                      onPress={() => {
                                        setEditingCollection(collection);
                                        onEditOpen();
                                      }}
                                    >
                                      Edit
                                    </DropdownItem>
                                    <DropdownItem
                                      key="share"
                                      startContent={
                                        <Share2 className="h-4 w-4" />
                                      }
                                      onPress={() =>
                                        shareCollection(collection.id)
                                      }
                                    >
                                      Share
                                    </DropdownItem>
                                    <DropdownItem
                                      key="delete"
                                      className="text-danger"
                                      color="danger"
                                      startContent={
                                        <Trash2 className="h-4 w-4" />
                                      }
                                      onPress={() =>
                                        deleteCollection(collection.id)
                                      }
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
          </>
        )}
      </div>

      {/* Create Collection Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Collection</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Collection Name"
                    placeholder="Enter collection name"
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe your collection"
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />

                  <Checkbox
                    isSelected={newCollection.is_public}
                    onValueChange={(checked) =>
                      setNewCollection((prev) => ({
                        ...prev,
                        is_public: checked,
                      }))
                    }
                  >
                    Make this collection public
                  </Checkbox>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <div className="mb-2 flex items-center space-x-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button size="sm" onPress={addTag}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newCollection.tags.map((tag) => (
                        <Chip
                          key={tag}
                          onClose={() => removeTag(tag)}
                          variant="flat"
                          color="primary"
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={createCollection}
                  isDisabled={!newCollection.name.trim()}
                >
                  Create Collection
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Collection Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Collection</ModalHeader>
              <ModalBody>
                {editingCollection && (
                  <div className="space-y-4">
                    <Input
                      label="Collection Name"
                      placeholder="Enter collection name"
                      value={editingCollection.name}
                      onChange={(e) =>
                        setEditingCollection((prev) =>
                          prev ? { ...prev, name: e.target.value } : null,
                        )
                      }
                    />

                    <Textarea
                      label="Description"
                      placeholder="Describe your collection"
                      value={editingCollection.description}
                      onChange={(e) =>
                        setEditingCollection((prev) =>
                          prev
                            ? { ...prev, description: e.target.value }
                            : null,
                        )
                      }
                    />

                    <Checkbox
                      isSelected={editingCollection.is_public}
                      onValueChange={(checked) =>
                        setEditingCollection((prev) =>
                          prev ? { ...prev, is_public: checked } : null,
                        )
                      }
                    >
                      Make this collection public
                    </Checkbox>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <div className="mb-2 flex items-center space-x-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEditingTag();
                            }
                          }}
                        />
                        <Button size="sm" onPress={addEditingTag}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingCollection.tags.map((tag) => (
                          <Chip
                            key={tag}
                            onClose={() => removeEditingTag(tag)}
                            variant="flat"
                            color="primary"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={updateCollection}
                  isDisabled={!editingCollection?.name.trim()}
                >
                  Update Collection
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Collection Modal */}
      <Modal
        isOpen={isViewOpen}
        onOpenChange={onViewOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>{selectedCollection?.name}</span>
                  <Chip
                    color={
                      selectedCollection?.is_public ? "success" : "default"
                    }
                    variant="flat"
                    startContent={
                      selectedCollection?.is_public ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )
                    }
                  >
                    {selectedCollection?.is_public ? "Public" : "Private"}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedCollection && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedCollection.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCollection.tags.map((tag) => (
                          <Chip
                            key={tag}
                            size="sm"
                            variant="flat"
                            color="primary"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 text-lg font-semibold">
                        Stories ({selectedCollection.story_count})
                      </h4>

                      {selectedCollection.stories.length === 0 ? (
                        <div className="py-8 text-center">
                          <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No stories in this collection yet.
                          </p>
                          <Button
                            as={Link}
                            href="/library"
                            color="primary"
                            size="sm"
                            className="mt-3"
                          >
                            Add Stories
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {selectedCollection.stories.map((story) => (
                            <Card
                              key={story.id}
                              className="transition-shadow hover:shadow-md"
                            >
                              <CardHeader className="p-0">
                                <img
                                  src={story.thumbnail || "/placeholder.jpg"}
                                  alt={story.title}
                                  className="h-32 w-full rounded-t-lg object-cover"
                                />
                              </CardHeader>
                              <CardBody className="p-3">
                                <h5 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                  {story.title}
                                </h5>
                                <div className="mt-2 flex items-center justify-between">
                                  <div className="flex space-x-1">
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      color="primary"
                                    >
                                      {story.art_style}
                                    </Chip>
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      color="secondary"
                                    >
                                      {story.story_length}
                                    </Chip>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                  >
                                    Read
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>
                          Created:{" "}
                          {new Date(
                            selectedCollection.created_at,
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          Updated:{" "}
                          {new Date(
                            selectedCollection.updated_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={<Edit3 className="h-4 w-4" />}
                  onPress={() => {
                    if (selectedCollection) {
                      setEditingCollection(selectedCollection);
                      onClose();
                      onEditOpen();
                    }
                  }}
                >
                  Edit Collection
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

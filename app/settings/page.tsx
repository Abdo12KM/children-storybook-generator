"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  Avatar,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Progress,
  Spinner,
} from "@heroui/react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  HardDrive,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Save,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Lock,
  Mail,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
  UserProfileService,
  type UserProfile,
  type UserPreferences,
  type StorageData,
} from "@/services";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_art_style: "cartoon",
    default_story_length: "medium",
    default_theme: "adventure",
    language: "en",
    auto_save: true,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    data_collection: true,
    public_profile: false,
    show_reading_progress: true,
    dark_mode: "system",
  });
  const [storageData, setStorageData] = useState<StorageData>({
    used_storage: 0,
    total_storage: 5 * 1024 * 1024 * 1024, // 5GB
    story_files: 0,
    image_files: 0,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onOpenChange: onExportOpenChange,
  } = useDisclosure();

  useEffect(() => {
    // Only load user data when auth is complete and user exists
    if (!loading && user) {
      loadUserData();
    } else if (!loading && !user) {
      // Authentication is complete but no user found - redirect to login
      router.push("/login");
    }
  }, [user, loading, router]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Double check authentication before making API calls
      if (!user) {
        // No authenticated user found - redirect to login
        router.push("/login");
        return;
      }

      // Load user profile and preferences
      const { profile, preferences: userPrefs } =
        await UserProfileService.getUserProfile();
      setUserProfile(profile);
      setPreferences(userPrefs);

      // Load real storage data from the database
      const storageData = await UserProfileService.getStorageData();
      setStorageData(storageData);
    } catch (error) {
      setError("Failed to load user data. Please refresh the page.");
      console.error("Failed to load user data:", error);

      // Check if the error is authentication related
      if (error instanceof Error && error.message.includes("authentication")) {
        // Authentication error - redirect to login
        router.push("/login");
        return;
      }

      // Set error message for user
      setError(
        "Failed to load user data. Please refresh the page to try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);
      await UserProfileService.updateProfile(userProfile);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      await UserProfileService.updatePreferences(preferences);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      // Show error toast
      const event = new CustomEvent("show-toast", {
        detail: {
          message: "Passwords don't match",
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    try {
      setSaving(true);
      await UserProfileService.changePassword(currentPassword, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      await UserProfileService.exportUserData();
      onExportOpenChange();
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await UserProfileService.deleteAccount();
      await signOut();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleClearCache = async () => {
    try {
      // Clear browser caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      }

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Clear service worker cache if available
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }

      // Show success message
      const event = new CustomEvent("show-toast", {
        detail: {
          message: "Cache cleared successfully!",
          type: "success",
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to clear cache:", error);
      const event = new CustomEvent("show-toast", {
        detail: {
          message: "Failed to clear cache. Please try again.",
          type: "error",
        },
      });
      window.dispatchEvent(event);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const storagePercentage = storageData
    ? (storageData.used_storage / storageData.total_storage) * 100
    : 0;

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "preferences", name: "Preferences", icon: Settings },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "storage", name: "Storage", icon: HardDrive },
    { id: "privacy", name: "Privacy", icon: Lock },
  ];

  // Show loading while authentication is being determined
  if (loading) {
    return (
      <div className="from-background via-background/95 to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null; // Component will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="from-background via-background/95 to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="max-w-md p-6">
              <CardBody className="text-center">
                <div className="mb-4 text-red-500">
                  <Settings className="mx-auto h-12 w-12" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Unable to Load Settings
                </h3>
                <p className="mb-4 text-gray-600">{error}</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onPress={() => router.back()}
                    className="flex-1"
                  >
                    Go Back
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => window.location.reload()}
                    className="flex-1"
                  >
                    Retry
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="flex-shrink-0 lg:w-64">
            <Card className="sticky top-24 rounded-lg bg-transparent">
              <CardBody className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        disableRipple
                        onPress={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center space-x-3 rounded-none px-4 py-3 text-start transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          activeTab === tab.id && "bg-default/80"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.name}</span>
                      </Button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">
                      Profile Information
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    {userProfile && (
                      <>
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <Avatar
                              src={userProfile.avatar_url}
                              name={userProfile.full_name}
                              size="lg"
                              className="h-24 w-24"
                            />
                            <Button
                              isIconOnly
                              size="sm"
                              color="primary"
                              className="absolute -right-1 -bottom-1"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {userProfile.full_name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {userProfile.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Member since{" "}
                              {new Date(
                                userProfile.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <Card className="bg-primary/10">
                            <CardBody className="text-center">
                              <div className="text-primary text-2xl font-bold">
                                {userProfile.story_count}
                              </div>
                              <div className="text-foreground/70 text-sm">
                                Stories Created
                              </div>
                            </CardBody>
                          </Card>
                          <Card className="bg-secondary/10">
                            <CardBody className="text-center">
                              <div className="text-secondary text-2xl font-bold">
                                {userProfile.collection_count}
                              </div>
                              <div className="text-foreground/70 text-sm">
                                Collections
                              </div>
                            </CardBody>
                          </Card>
                          <Card className="bg-success/10">
                            <CardBody className="text-center">
                              <div className="text-success text-2xl font-bold">
                                {userProfile.total_reads}
                              </div>
                              <div className="text-foreground/70 text-sm">
                                Total Reads
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Profile Form */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Input
                            label="Full Name"
                            value={userProfile.full_name}
                            onChange={(e) =>
                              setUserProfile((prev) =>
                                prev
                                  ? { ...prev, full_name: e.target.value }
                                  : null,
                              )
                            }
                          />
                          <Input
                            label="Email"
                            type="email"
                            value={userProfile.email}
                            isReadOnly
                            description="Email cannot be changed"
                          />
                          <Input
                            label="Location"
                            value={userProfile.location || ""}
                            onChange={(e) =>
                              setUserProfile((prev) =>
                                prev
                                  ? { ...prev, location: e.target.value }
                                  : null,
                              )
                            }
                          />
                          <Input
                            label="Website"
                            value={userProfile.website || ""}
                            onChange={(e) =>
                              setUserProfile((prev) =>
                                prev
                                  ? { ...prev, website: e.target.value }
                                  : null,
                              )
                            }
                          />
                        </div>

                        <Textarea
                          label="Bio"
                          placeholder="Tell us about yourself"
                          value={userProfile.bio || ""}
                          onChange={(e) =>
                            setUserProfile((prev) =>
                              prev ? { ...prev, bio: e.target.value } : null,
                            )
                          }
                        />

                        <div className="flex justify-end">
                          <Button
                            color="primary"
                            startContent={<Save className="h-4 w-4" />}
                            onPress={saveProfile}
                            isLoading={isSaving}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Story Preferences</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Select
                        label="Default Art Style"
                        selectedKeys={[preferences.default_art_style]}
                        onSelectionChange={(keys) =>
                          setPreferences((prev) => ({
                            ...prev,
                            default_art_style: Array.from(keys)[0] as string,
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
                        label="Default Story Length"
                        selectedKeys={[preferences.default_story_length]}
                        onSelectionChange={(keys) =>
                          setPreferences((prev) => ({
                            ...prev,
                            default_story_length: Array.from(keys)[0] as string,
                          }))
                        }
                      >
                        <SelectItem key="short">Short (5-8 pages)</SelectItem>
                        <SelectItem key="medium">
                          Medium (9-12 pages)
                        </SelectItem>
                        <SelectItem key="long">Long (13+ pages)</SelectItem>
                      </Select>

                      <Select
                        label="Default Theme"
                        selectedKeys={[preferences.default_theme]}
                        onSelectionChange={(keys) =>
                          setPreferences((prev) => ({
                            ...prev,
                            default_theme: Array.from(keys)[0] as string,
                          }))
                        }
                      >
                        <SelectItem key="adventure">Adventure</SelectItem>
                        <SelectItem key="friendship">Friendship</SelectItem>
                        <SelectItem key="courage">Courage</SelectItem>
                        <SelectItem key="kindness">Kindness</SelectItem>
                        <SelectItem key="learning">Learning</SelectItem>
                        <SelectItem key="nature">Nature</SelectItem>
                      </Select>

                      <Select
                        label="Language"
                        selectedKeys={[preferences.language]}
                        onSelectionChange={(keys) =>
                          setPreferences((prev) => ({
                            ...prev,
                            language: Array.from(keys)[0] as string,
                          }))
                        }
                      >
                        <SelectItem key="en">English</SelectItem>
                        <SelectItem key="es">Spanish</SelectItem>
                        <SelectItem key="fr">French</SelectItem>
                        <SelectItem key="de">German</SelectItem>
                        <SelectItem key="it">Italian</SelectItem>
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">App Preferences</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-save stories</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically save your progress while creating
                          stories
                        </p>
                      </div>
                      <Switch
                        color="success"
                        isSelected={preferences.auto_save}
                        onValueChange={(checked) =>
                          setPreferences((prev) => ({
                            ...prev,
                            auto_save: checked,
                          }))
                        }
                      />
                    </div>

                    <Divider />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show reading progress</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Display reading progress indicators in stories
                        </p>
                      </div>
                      <Switch
                        color="success"
                        isSelected={preferences.show_reading_progress}
                        onValueChange={(checked) =>
                          setPreferences((prev) => ({
                            ...prev,
                            show_reading_progress: checked,
                          }))
                        }
                      />
                    </div>
                  </CardBody>
                </Card>

                <div className="flex justify-end">
                  <Button
                    color="primary"
                    startContent={<Save className="h-4 w-4" />}
                    onPress={savePreferences}
                    isLoading={isSaving}
                  >
                    Save Preferences
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">
                      Notification Preferences
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">Email notifications</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Receive email updates about your stories and
                              account
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={preferences.email_notifications}
                          onValueChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              email_notifications: checked,
                            }))
                          }
                        />
                      </div>

                      <Divider />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">Push notifications</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Receive push notifications on your device
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={preferences.push_notifications}
                          onValueChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              push_notifications: checked,
                            }))
                          }
                        />
                      </div>

                      <Divider />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">Marketing emails</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Receive updates about new features and promotions
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={preferences.marketing_emails}
                          onValueChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              marketing_emails: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        startContent={<Save className="h-4 w-4" />}
                        onPress={savePreferences}
                        isLoading={isSaving}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Security Settings</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <Input
                          label="Current Password"
                          type={showPasswords.current ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          endContent={
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  current: !prev.current,
                                }))
                              }
                            >
                              {showPasswords.current ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          }
                        />
                        <Input
                          label="New Password"
                          type={showPasswords.new ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          endContent={
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  new: !prev.new,
                                }))
                              }
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          }
                        />
                        <Input
                          label="Confirm New Password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          endContent={
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  confirm: !prev.confirm,
                                }))
                              }
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          }
                        />
                        <Button
                          color="primary"
                          onPress={changePassword}
                          isLoading={isSaving}
                          isDisabled={
                            !currentPassword ||
                            !newPassword ||
                            newPassword !== confirmPassword
                          }
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Account Actions
                      </h3>
                      <div className="space-y-3">
                        <Button
                          variant="bordered"
                          startContent={<Download className="h-4 w-4" />}
                          onPress={onExportOpen}
                        >
                          Export My Data
                        </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          startContent={<Trash2 className="h-4 w-4" />}
                          onPress={onDeleteOpen}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {/* Storage Tab */}
            {activeTab === "storage" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Storage Usage</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    {storageData ? (
                      <>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">Storage Used</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatBytes(storageData.used_storage)} of{" "}
                              {formatBytes(storageData.total_storage)}
                            </span>
                          </div>
                          <Progress
                            value={storagePercentage}
                            color={
                              storagePercentage > 80
                                ? "danger"
                                : storagePercentage > 60
                                  ? "warning"
                                  : "primary"
                            }
                            className="w-full"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            {(100 - storagePercentage).toFixed(1)}% remaining
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Card className="border">
                            <CardBody className="text-center">
                              <div className="text-primary text-2xl font-bold">
                                {storageData.story_files}
                              </div>
                              <div className="text-foreground/70 text-sm">
                                Story Files
                              </div>
                            </CardBody>
                          </Card>
                          <Card className="border">
                            <CardBody className="text-center">
                              <div className="text-secondary text-2xl font-bold">
                                {storageData.image_files}
                              </div>
                              <div className="text-foreground/70 text-sm">
                                Image Files
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        <div>
                          <h3 className="mb-4 text-lg font-medium">
                            Storage Management
                          </h3>
                          <div className="space-y-3">
                            <Button
                              variant="bordered"
                              startContent={<Trash2 className="h-4 w-4" />}
                              onPress={handleClearCache}
                            >
                              Clear Cache
                            </Button>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Clear temporary files and cached data to free up
                              space.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-500">
                          Storage data not available
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-2">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">Public profile</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Allow others to see your profile and public
                              collections
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={preferences.public_profile}
                          onValueChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              public_profile: checked,
                            }))
                          }
                        />
                      </div>

                      <Divider />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">Data collection</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Allow us to collect usage data to improve the
                              service
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={preferences.data_collection}
                          onValueChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              data_collection: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        startContent={<Save className="h-4 w-4" />}
                        onPress={savePreferences}
                        isLoading={isSaving}
                      >
                        Save Privacy Settings
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Export Data Modal */}
      <Modal isOpen={isExportOpen} onOpenChange={onExportOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Export Your Data</ModalHeader>
              <ModalBody>
                <p>
                  We'll prepare a downloadable file containing all your stories,
                  collections, and account data. This may take a few minutes.
                </p>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> The export will include your personal
                    information, stories, and images. Please handle this data
                    carefully.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={exportData}>
                  Export Data
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-danger">Delete Account</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>This will permanently delete:</strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                      <li>• All your stories and collections</li>
                      <li>• Your profile and account data</li>
                      <li>• All uploaded images and files</li>
                      <li>• Your preferences and settings</li>
                    </ul>
                  </div>
                  <Input
                    placeholder="Type 'DELETE' to confirm"
                    description="Please type DELETE to confirm account deletion"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={deleteAccount}>
                  Delete Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

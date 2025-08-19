"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import {
  BookOpen,
  LogOut,
  Settings,
  Library,
  FolderOpen,
  Plus,
  Home,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

interface NavbarProps {
  showNavItems?: boolean;
}

export function Navbar({ showNavItems = true }: NavbarProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/create", label: "Create Story", icon: Plus },
    { href: "/library", label: "Library", icon: Library },
    { href: "/collections", label: "Collections", icon: FolderOpen },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <NextUINavbar
      maxWidth="full"
      className="bg-background/80 border-b backdrop-blur-sm"
      height="4rem"
    >
      <NavbarBrand>
        <NextLink href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="text-primary h-8 w-8" />
          <span className="text-xl font-bold">StorySprout</span>
        </NextLink>
      </NavbarBrand>

      {showNavItems && user && (
        <NavbarContent className="hidden gap-6 md:flex" justify="center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavbarItem key={item.href}>
                <Link
                  as={NextLink}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      )}

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  radius="md"
                  className="cursor-pointer transition-transform"
                  src={user?.user_metadata?.avatar_url}
                  name={user?.user_metadata?.full_name || user?.email}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 cursor-default gap-2"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                </DropdownItem>
                {/* <DropdownItem
                  key="dashboard"
                  startContent={<Home className="h-4 w-4" />}
                  as={NextLink}
                  href="/dashboard"
                >
                  Dashboard
                </DropdownItem> */}
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="h-4 w-4" />}
                  as={NextLink}
                  href="/settings"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="h-4 w-4" />}
                  onPress={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Button
                as={NextLink}
                href="/login"
                color="default"
                variant="ghost"
              >
                Sign In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NextLink}
                href="/signup"
                color="primary"
                variant="shadow"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
}

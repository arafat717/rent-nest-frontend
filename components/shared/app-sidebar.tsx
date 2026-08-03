"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/src/assets/logo.png";
import {
  LayoutDashboard,
  User,
  Users,
  Home,
  Building2,
  ClipboardList,
  CreditCard,
  Star,
  PlusCircle,
  ShieldCheck,
  MessageSquareWarning,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  tenant: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/tenant",
        icon: LayoutDashboard,
      },
      {
        title: "My Requests",
        url: "/dashboard/tenant/requests",
        icon: ClipboardList,
      },
      {
        title: "Payments",
        url: "/dashboard/tenant/payments",
        icon: CreditCard,
      },
      {
        title: "Your Profile",
        url: "/dashboard/tenant/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  landlord: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/landlord",
        icon: LayoutDashboard,
      },
      {
        title: "My Properties",
        url: "/dashboard/landlord/properties",
        icon: Building2,
        items: [
          {
            title: "All Properties",
            url: "/dashboard/landlord/properties",
            icon: Building2,
          },
          {
            title: "Add New Property",
            url: "/dashboard/landlord/properties/new",
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Rental Requests",
        url: "/dashboard/landlord/requests",
        icon: ClipboardList,
      },
      // {
      //   title: "Earnings",
      //   url: "/dashboard/landlord/earnings",
      //   icon: CreditCard,
      // },
      {
        title: "Your Profile",
        url: "/dashboard/landlord/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "Properties",
        url: "/dashboard/admin/properties",
        icon: Building2,
      },
      {
        title: "Rental Requests",
        url: "/dashboard/admin/requests",
        icon: ClipboardList,
      },
      // {
      //   title: "Reports & Moderation",
      //   url: "/dashboard/admin/reports",
      //   icon: MessageSquareWarning,
      // },
      // {
      //   title: "Payments",
      //   url: "/dashboard/admin/payments",
      //   icon: CreditCard,
      // },
      {
        title: "Your Profile",
        url: "/dashboard/admin/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
};

interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role?.toLowerCase() as keyof typeof data];

  if (!sidebarData) {
    // Unknown/missing role — render nothing rather than crash on undefined items
    return null;
  }

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-white border-r border-blue-200"
      {...props}
    >
      <SidebarHeader>
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center"
        >
          <Image
            src={Logo.src}
            alt="Logo"
            width={300}
            height={300}
            className="size-auto"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

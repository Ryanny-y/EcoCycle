import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useAuth from "@/contexts/AuthContext";
import {
  ArrowLeftRight,
  Boxes,
  ChartColumn,
  LayoutDashboard,
  LogOut,
  Package,
  Recycle,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router";

export function AppSidebar() {
  const { authResponse, logout } = useAuth();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname]);

  const navGroups = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "Records & Entities",
      items: [
        {
          title: "Residents",
          url: "/records/residents",
          icon: Users,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
        {
          title: "Non-Residents",
          url: "/records/non-residents",
          icon: UserPlus,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "Transactions & Rewards",
      items: [
        {
          title: "Earn Points",
          url: "/rewards/earn-points",
          icon: Recycle,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
        {
          title: "Redeem Points",
          url: "/rewards/redeem",
          icon: ArrowLeftRight,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
        {
          title: "Statistics",
          url: "/rewards/statistics",
          icon: ChartColumn,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "Inventory Management",
      items: [
        {
          title: "Reward Items",
          url: "/inventory/reward-items",
          icon: Boxes,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
        {
          title: "Materials",
          url: "/inventory/materials",
          icon: Package,
          roles: ["ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          roles: ["SUPER_ADMIN"],
        },
      ],
    },
  ];

  if (!authResponse) return null;
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles) return true;

        return item.roles.includes(authResponse.data.role);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar>
      <SidebarHeader className="px-3 border-b">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-3 py-3">
            <div className="h-12 w-12">
              <img
                src="/talipapa_logo.png"
                alt="Barangay Talipapa Logo"
                className="h-full w-full"
              />
            </div>
            <div>
              <h1 className="font-black text-base text-foreground">
                Barangay Talipapa
              </h1>
              <p className="text-stone-400 text-sm">Admin Dashboard</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1 py-3 gap-1">
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.title} className="py-0">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      `${isActive ? "bg-emerald-50 text-emerald-700" : "hover:bg-emerald-50/30 hover:text-emerald-700"} group flex items-center gap-3 px-2 rounded-xl group duration-200`
                    }
                  >
                    <item.icon strokeWidth={2.1} size={24} />
                    <span className="font-semibold text-[14px] w-full py-2">
                      {item.title}
                    </span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={logout}
              className="flex items-center gap-2 p-3 sm:hidden text-sm font-medium"
            >
              <LogOut
                size={16}
                className="text-muted-foreground hover:text-destructive duration-200"
              />{" "}
              Logout
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Recycle, UserPlus, Users } from "lucide-react";
import { NavLink } from "react-router";

export function AppSidebar() {
  const navGroups = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
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
        },
        {
          title: "Non-Residents",
          url: "/records/non-residents",
          icon: UserPlus,
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
        },
        {
          title: "Swap Items",
          url: "/rewards/exchange-items",
          icon: UserPlus,
        },
      ],
    },
  ];

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

      <SidebarContent className="px-1 py-3 gap-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} className="py-0">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      `${isActive ? "bg-emerald-50" : "hover:bg-emerald-50/30"} group flex items-center gap-2 px-2 rounded-xl `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          strokeWidth={2.1}
                          size={22}
                          color={isActive ? "#007a55" : "#4a5565"}
                        />
                        <span
                          className={`font-semibold text-[14px] w-full py-2.5 ${
                            isActive
                              ? "text-emerald-700"
                              : "text-gray-600 hover:text-emerald-700"
                          }`}
                        >
                          {item.title}
                        </span>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

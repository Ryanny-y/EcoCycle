import { Clock, LogOut } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useAuth from "@/contexts/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase()

  return (
    <header className="bg-white p-3 top-0 right-0 left-0 flex items-center justify-between border-b">
      <div className="flex items-center gap-5">
        <SidebarTrigger />
        <div className="hidden sm:flex items-center gap-3 px-5 py-2 rounded-xl text-white bg-primary">
          <Clock size={20}/>
          <div>
            <p className="font-semibold leading-tight text-sm">{formattedTime}</p>
            <p className="text-[11px]">{formattedDate}</p>
          </div>
        </div>

        <div className="flex gap-2 text-xs rounded-lg font-medium sm:hidden bg-primary p-3 text-white">
          <p>{dayjs().format("dddd")}, {formattedTime}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 pr-5">
        <div className="text-right">
          <p className="font-bold text-sm">Username</p>
          <p className="text-xs uppercase font-semibold text-muted-foreground">
            Admin Staff
          </p>
        </div>

        <button onClick={logout} className="hidden md:auto">
          <LogOut className="text-muted-foreground hover:text-destructive duration-200" />
        </button>
      </div>
    </header>
  );
};

export default Header;

import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth/session";

export default function AuthGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || location.pathname === "/login" || isAuthenticated()) {
      return;
    }

    const searchStr = typeof location.searchStr === "string" ? location.searchStr : "";
    navigate({
      to: "/login",
      search: { redirect: `${location.pathname}${searchStr}` },
      replace: true,
    });
  }, [isClient, location.pathname, location.searchStr, navigate]);

  if (!isClient) {
    return null;
  }

  if (location.pathname !== "/login" && !isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

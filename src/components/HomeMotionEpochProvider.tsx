"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

const HomeMotionEpochContext = createContext(0);

export function useHomeMotionEpoch() {
  return useContext(HomeMotionEpochContext);
}

/**
 * Keeps a small "epoch" counter that increments every time the app
 * transitions from any sub-route back to the homepage.
 *
 * Homepage motion-heavy sections key off this epoch to force a clean
 * remount when returning to `/` (including back button restores that
 * reuse Next.js route cache).
 */
export default function HomeMotionEpochProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const prev = prevPathRef.current;
    if (pathname === "/" && prev !== null && prev !== "/") {
      setEpoch((v) => v + 1);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <HomeMotionEpochContext.Provider value={epoch}>
      {children}
    </HomeMotionEpochContext.Provider>
  );
}

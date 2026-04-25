import type { ReactNode } from "react";
import HomeReturnReload from "@/components/HomeReturnReload";

export default function RootTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeReturnReload />
      {children}
    </>
  );
}

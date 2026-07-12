/*
 * lib/usePageTitle.ts — lets a dashboard page set the title Header renders.
 */
"use client";

import { useEffect } from "react";
import { usePageTitleStore } from "@/lib/store";

export function usePageTitle(title: string) {
  const setTitle = usePageTitleStore((s) => s.setTitle);

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
}

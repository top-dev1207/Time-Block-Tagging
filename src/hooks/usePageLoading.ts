"use client";

import { useEffect } from "react";
import { useLoading } from "@/components/dashboard/LoadingProvider";

export const usePageLoading = () => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Page has mounted, hide loading
    setIsLoading(false);
  }, [setIsLoading]);

  return { setIsLoading };
};
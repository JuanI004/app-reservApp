"use client";
import { createContext, useContext } from "react";

export const HomeContext = createContext();
export function useHomeContext() {
  return useContext(HomeContext);
}

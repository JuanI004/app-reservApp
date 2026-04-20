"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHomeContext } from "./layout";

import HomeOwner from "../../components/home/homeOwner";
import HomeUser from "../../components/home/homeUser";

export default function Home() {
  const { rol } = useHomeContext();
  const router = useRouter();

  useEffect(() => {
    if (rol !== "owner" && rol !== "user") {
      router.push("/login");
    }
  }, [rol, router]);

  if (rol === "owner") return <HomeOwner />;
  if (rol === "user") return <HomeUser />;

  return null;
}

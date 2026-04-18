"use client";

import { useHomeContext } from "./layout";

import HomeOwner from "../../components/home/homeOwner";
import HomeUser from "../../components/home/homeUser";

export default function Home() {
  const { rol, session } = useHomeContext();

  if (rol === "owner") return <HomeOwner />;
  if (rol === "user") return <HomeUser />;

  router.push("/login");
  return null;
}

import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import Header from "./header";
import Bottom from "./bottom";
export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Bottom />
    </>
  );
}

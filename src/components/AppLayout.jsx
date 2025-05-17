import React from "react";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";

import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div id="app">
      <Toaster
        toastOptions={{
          style: {
            fontSize: "1.5rem",
          },
        }}
      />
      <Header />
      <Outlet />
    </div>
  );
}

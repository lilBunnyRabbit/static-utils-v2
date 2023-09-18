import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import "./DashboardLayout.scss";

export const DashboardLayout: React.FC = () => {
  return (
    <>
      <DashboardNavbar />
      <Outlet />
    </>
  );
};

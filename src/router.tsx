import { IndexView } from "@/views/index/IndexView";
import React from "react";
import { Navigate, createHashRouter } from "react-router-dom";
import { DashboardLayout } from "./layouts/dashboard/DashboardLayout";
import * as Pages from "./pages";
import { PageInfo } from "./types/page.type";
import { DatabaseView } from "./views/database/DatabaseView";
import { DesignView } from "./views/design/DesignView";

const pagesKeys = Object.keys(Pages) as Array<keyof typeof Pages>;

export const pages: PageInfo[] = pagesKeys.map((key) => Pages[key].info);

export const router = createHashRouter([
  {
    index: true,
    element: <IndexView />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      ...pagesKeys.map((key) => ({
        path: Pages[key].info.path,
        element: React.createElement(Pages[key].View),
      })),
      {
        path: "database",
        element: <DatabaseView />,
      },
      {
        path: "design",
        element: <DesignView />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

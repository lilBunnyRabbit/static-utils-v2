import { ImageConcatView } from "@/views/image-concat/ImageConcatView";
import { ImageCropView } from "@/views/image-crop/ImageCropView";
import { IndexView } from "@/views/index/IndexView";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { DatabaseView } from "./views/database/DatabaseView";
import { DesignView } from "./views/design/DesignView";

export const router = createBrowserRouter(
  [
    {
      index: true,
      element: <IndexView />,
    },
    {
      path: "image-crop",
      element: <ImageCropView />,
    },
    {
      path: "image-concat",
      element: <ImageConcatView />,
    },
    {
      path: "database",
      element: <DatabaseView />,
    },
    {
      path: "design",
      element: <DesignView />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

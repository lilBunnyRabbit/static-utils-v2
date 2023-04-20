import { ImageConcatView } from "@/views/image-concat/ImageConcatView";
import { ImageCropView } from "@/views/image-crop/ImageCropView";
import { IndexView } from "@/views/index/IndexView";
import { Navigate, createBrowserRouter } from "react-router-dom";

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
      path: "*",
      element: <Navigate to="/" />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

import { Button } from "@/components/buttons";
import React from "react";
import { To } from "react-router";
import { Link } from "react-router-dom";

const paths: Array<{ title: string; description: string; to: To }> = [
  {
    title: "Image Crop",
    description: "...",
    to: "image-crop",
  },
  {
    title: "Image Concat",
    description: "...",
    to: "image-concat",
  },
];

export const IndexView: React.FC = () => {
  return (
    <div className="w-full min-h-screen grid grid-cols-[repeat(3,256px)] justify-center place-items-center p-8">
      {paths.map((path, i) => (
        <Link key={`path-link-${i}`} to={path.to}>
          <Button className="flex flex-col gap-4 !h-fit">
            <h2 className="font-bold text-xl" children={path.title} />
            <div>{path.description}</div>
          </Button>
        </Link>
      ))}
    </div>
  );
};

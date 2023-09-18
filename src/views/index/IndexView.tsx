import { Button } from "@/components/buttons";
import { pages } from "@/router";
import React from "react";
import { Link } from "react-router-dom";

export const IndexView: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen gap-4">
      <h1>Static Utils</h1>
      <div className=" grid grid-cols-[repeat(3,256px)] justify-center place-items-center p-8">
        {pages.map(({ name, description, path }, i) => (
          <Link key={`path-link-${i}`} to={path}>
            <Button className="flex flex-col gap-4 !h-fit">
              <h2 className="font-bold text-xl" children={name} />
              <div>{description}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

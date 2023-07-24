import { Button } from "@/components/buttons";
import { IconButton } from "@/components/buttons/IconButton";
import { Icon } from "@/components/icons";
import { propertyCombinations } from "@/utils/misc.util";
import React from "react";
import { DesignSection, InvertedPropTable, stringElement } from "./DesignHelpers";
import { Input } from "@/components/inputs";

export const DesignView: React.FC = () => (
  <div className="flex flex-col gap-8 p-8">
    <DesignSection
      title="Button"
      children={() => {
        const combinations = propertyCombinations<React.ComponentProps<typeof Button>>({
          color: [undefined, "primary", "secondary", "error", "success"],
          size: ["sm", undefined, "lg"],
        });

        return (
          <InvertedPropTable
            props={combinations.map((props) => (
              <code children={stringElement("Button", props)} />
            ))}
            variants={["Default", "Disabled"]}
            elements={combinations.map((props) => [
              <Button children="Button" {...props} />,
              <Button disabled children="Button" {...props} />,
            ])}
          />
        );
      }}
    />

    <DesignSection
      title="Icon Button"
      children={() => {
        const combinations = propertyCombinations<React.ComponentProps<typeof IconButton>>({
          color: [undefined, "primary", "secondary", "error", "success"],
          size: ["sm", undefined, "lg"],
        });

        return (
          <InvertedPropTable
            props={combinations.map((props) => (
              <code children={stringElement("IconButton icon={Alert}", props)} />
            ))}
            variants={["Default", "Disabled"]}
            elements={combinations.map((props) => [
              <IconButton {...props} icon={Icon.Alert} />,
              <IconButton disabled {...props} icon={Icon.Alert} />,
            ])}
          />
        );
      }}
    />

    <DesignSection
      title="Input"
      children={() => {
        const combinations = propertyCombinations<React.ComponentProps<typeof Input>>({
          label: [undefined, "Label"],
        });

        return (
          <InvertedPropTable
            props={combinations.map((props) => (
              <code children={stringElement("Input", props)} />
            ))}
            variants={["Default", "Disabled"]}
            elements={combinations.map((props) => [<Input {...props} />, <Input disabled {...props} />])}
          />
        );
      }}
    />
  </div>
);

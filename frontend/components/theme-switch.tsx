"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Passer en mode ${theme === "light" || isSSR ? "sombre" : "clair"}`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-2 py-1 transition-opacity hover:opacity-80 cursor-pointer rounded-full",
          "bg-cream/80 shadow-md border border-gray-300", // Fond crème semi-transparent avec une bordure subtile
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-5 h-5 flex items-center justify-center rounded-full",
              "transition-all duration-300 ease-in-out",
              isSelected
                ? "bg-gray-900 text-gray-300 shadow-lg" // Mode sombre
                : "bg-cream text-gray-700 shadow", // Mode clair
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunFilledIcon
            className="text-yellow-500 transition-all duration-300"
            size={18}
          />
        ) : (
          <MoonFilledIcon
            className="text-blue-300 transition-all duration-300"
            size={18}
          />
        )}
      </div>
    </Component>
  );
};

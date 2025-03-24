"use client";

import { FC, useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
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
  const [mounted, setMounted] = useState(false);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const onThemeChange = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: isDarkMode,
      "aria-label": `Passer en mode ${isDarkMode ? "clair" : "sombre"}`,
      onChange: onThemeChange,
    });

  if (!mounted) {
    return <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />;
  }

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-2 py-1 transition-opacity rounded-full",
          "hover:opacity-80 cursor-pointer",
          "bg-cream/80 shadow-md border border-gray-300",
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
            "w-5 h-5 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
            isDarkMode
              ? "bg-gray-800 text-gray-300 shadow-lg"
              : "bg-cream text-gray-700 shadow",
            classNames?.wrapper,
          ),
        })}
      >
        {isDarkMode ? (
          <MoonFilledIcon
            className="text-blue-300 transition-all duration-300"
            size={18}
          />
        ) : (
          <SunFilledIcon
            className="text-yellow-500 transition-all duration-300"
            size={18}
          />
        )}
      </div>
    </Component>
  );
};

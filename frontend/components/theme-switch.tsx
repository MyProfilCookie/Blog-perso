"use client";

import { FC, useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

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
  const [isAutoMode, setIsAutoMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("themeMode") !== "manual";
    }
    return true;
  });
  const isDarkMode = theme === "dark";

  useEffect(() => {
    setMounted(true);

    const applyThemeBasedOnTime = () => {
      if (!isAutoMode) return;
      const currentHour = new Date().getHours();
      const shouldBeDark = currentHour >= 20 || currentHour < 7;

      if (shouldBeDark && theme !== "dark") {
        setTheme("dark");
      } else if (!shouldBeDark && theme !== "light") {
        setTheme("light");
      }
    };

    applyThemeBasedOnTime();
    const intervalId = setInterval(applyThemeBasedOnTime, 60000);

    return () => clearInterval(intervalId);
  }, [isAutoMode, theme, setTheme]);

  const onThemeChange = () => {
    if (isAutoMode) return;
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    localStorage.setItem("themeMode", newAutoMode ? "auto" : "manual");

    if (newAutoMode) {
      const currentHour = new Date().getHours();
      const shouldBeDark = currentHour >= 20 || currentHour < 7;
      const newTheme = shouldBeDark ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    }
  };

  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: isDarkMode,
      "aria-label": `Passer en mode ${isDarkMode ? "clair" : "sombre"}`,
      onChange: onThemeChange,
      isDisabled: isAutoMode,
    });

  if (!mounted) {
    return <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Component
        {...getBaseProps({
          className: clsx(
            "px-2 py-1 transition-opacity rounded-full",
            isAutoMode
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80 cursor-pointer",
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

      <button
        className={clsx(
          "text-xs px-3 py-1.5 rounded-md transition-colors font-medium",
          isAutoMode
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-blue-100 text-blue-800 border border-blue-300",
        )}
        title={isAutoMode ? "Mode automatique (20h-7h)" : "Mode manuel"}
        onClick={toggleAutoMode}
      >
        {isAutoMode ? "Auto" : "Manuel"}
      </button>
    </div>
  );
};

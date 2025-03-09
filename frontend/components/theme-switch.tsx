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
  startNightModeHour?: number;
  endNightModeHour?: number;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
  startNightModeHour = 20,
  endNightModeHour = 7,
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const isDarkMode = resolvedTheme === "dark";

  const isNightTime = () => {
    const currentHour = new Date().getHours();

    return currentHour >= startNightModeHour || currentHour < endNightModeHour;
  };

  useEffect(() => {
    setMounted(true);

    const applyThemeBasedOnTime = () => {
      if (!isAutoMode) return;
      const shouldBeDark = isNightTime();

      if (shouldBeDark && resolvedTheme !== "dark") {
        setTheme("dark");
      } else if (!shouldBeDark && resolvedTheme !== "light") {
        setTheme("light");
      }
    };

    applyThemeBasedOnTime();
    const intervalId = setInterval(applyThemeBasedOnTime, 60000);

    return () => clearInterval(intervalId);
  }, [
    resolvedTheme,
    setTheme,
    isAutoMode,
    startNightModeHour,
    endNightModeHour,
  ]);

  const onThemeChange = () => {
    if (isAutoMode) return;
    setTheme(isDarkMode ? "light" : "dark");
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;

    setIsAutoMode(newAutoMode);

    // Only apply automatic theme if switching TO auto mode
    if (newAutoMode) {
      const shouldBeDark = isNightTime();

      setTheme(shouldBeDark ? "dark" : "light");
    }
    // When switching to manual, keep current theme
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
    <div className="flex items-center gap-4">
      <div className="flex items-center">
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
      </div>

      <button
        className={clsx(
          "text-xs px-3 py-1.5 rounded-md transition-colors font-medium",
          isAutoMode
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-blue-100 text-blue-800 border border-blue-300",
        )}
        title={
          isAutoMode
            ? `Mode automatique (${startNightModeHour}h-${endNightModeHour}h)`
            : "Mode manuel"
        }
        onClick={toggleAutoMode}
      >
        {isAutoMode ? "Auto" : "Manuel"}
      </button>
    </div>
  );
};

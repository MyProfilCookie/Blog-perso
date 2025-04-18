import { tv } from "tailwind-variants";

export const title = (p0?: { color: string; class: string; }) => "text-2xl font-bold tracking-tight";

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

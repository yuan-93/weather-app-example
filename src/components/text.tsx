import clsx from "clsx";
import { ElementType } from "react";
import { PolymorphicComponentProp } from "../types";

export interface TextProps {
  size?: keyof typeof sizeVariants;
  className?: string;
}

const sizeVariants = {
  headline: "text-6xl sm:text-8xl",
  caption: "text-[0.5rem] sm:text-[0.625rem]",
  body: "text-sm sm:text-base",
  label: "text-xs sm:text-sm",
};

export const Text = function Text<C extends ElementType = "span">({
  as,
  size = "body",
  children,
  className,
  ...rest
}: PolymorphicComponentProp<C, TextProps>) {
  const Component = as || "span";

  return (
    <Component
      size={size}
      className={clsx(`${sizeVariants[size]}`, className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

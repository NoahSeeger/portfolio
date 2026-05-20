"use client";
import React, { useMemo, type JSX } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
  baseColor?: string;
  gradientColor?: string;
}

export function TextShimmer({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
  baseColor = "#007bff",
  gradientColor = "#66b2ff",
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-clip-text text-transparent",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={{
        "--spread": `${dynamicSpread}px`,
        "--base-color": baseColor,
        "--base-gradient-color": gradientColor,
        backgroundImage: `linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--base-gradient-color), transparent calc(50% + var(--spread))), linear-gradient(var(--base-color), var(--base-color))`,
        backgroundSize: "250% 100%, 100% 100%",
      } as React.CSSProperties}
    >
      {children}
    </MotionComponent>
  );
}

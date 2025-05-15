"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-orange-100 to-orange-200">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-orange-400 to-orange-500" />
    </SliderPrimitive.Track>
    {Array.isArray(props.defaultValue) ? (
      // Se for um array (para range sliders)
      props.defaultValue.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-7 w-7 rounded-full border-4 border-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_0_10px_rgba(0,0,0,0.2)] ring-offset-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:pointer-events-none disabled:opacity-50 hover:from-orange-400 hover:to-orange-500 cursor-grab active:cursor-grabbing active:scale-95"
        />
      ))
    ) : (
      // Para sliders normais com um único thumb
      <SliderPrimitive.Thumb
        className="block h-7 w-7 rounded-full border-4 border-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_0_10px_rgba(0,0,0,0.2)] ring-offset-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:pointer-events-none disabled:opacity-50 hover:from-orange-400 hover:to-orange-500 cursor-grab active:cursor-grabbing active:scale-95"
      />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

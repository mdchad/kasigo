"use client";

import { Particles } from "@/components/magicui/particles";
import {TextAnimate} from "@/components/magicui/text-animate";

export function Example2() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = "#fff"

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none text-white">
        Kasigo
      </span>
      <div className="mt-10 text-white">
        <TextAnimate animation="blurInUp" by="character" as="p">Act now</TextAnimate>
        <TextAnimate animation="blurInUp" by="character" as={'p'} delay={0.7}>Go for it</TextAnimate>
        <TextAnimate animation="blurInUp" by="character" as={'p'} delay={1.3}>Kasi go</TextAnimate>
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}

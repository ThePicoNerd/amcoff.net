"use client";

import { martianMono } from "@/app/fonts";
import { useCallback, useEffect, useRef } from "react";

function randomHexByte() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
}

const UPDATE_FREQ = 0.01;

function Row(props: { x: number; y: number }) {
  const textRef = useRef<SVGTextElement>(null);
  const frameRef = useRef<number | null>(null);
  const updateCountRef = useRef(0);

  const draw = useCallback((t: DOMHighResTimeStamp) => {
    const element = textRef.current;
    if (!element) return;

    const bytes = element.textContent!.split(" ");

    let updates = 0;
    while (updateCountRef.current < t * UPDATE_FREQ) {
      bytes[Math.floor(Math.random() * bytes.length)] = randomHexByte();
      updateCountRef.current++;
      updates++;

      if (updates > 10) {
        break;
      }
    }
    bytes[Math.floor(Math.random() * bytes.length)] = randomHexByte();

    element.textContent = bytes.join(" ");

    frameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (typeof frameRef.current === "number") {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [draw]);

  return (
    <text
      ref={textRef}
      {...props}
      className={martianMono.className + " fill-neutral-700"}
      style={{ fontSize: 8 }}
    >
      {Array.from({ length: 8 }, () => "00").join(" ")}
    </text>
  );
}

export default function Background() {
  return (
    <svg className="fixed inset-0 w-full h-full -z-10">
      <defs>
        <pattern
          id="text"
          x="0"
          y="0"
          width="134.41"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            className="fill-neutral-900"
          />
          {Array.from({ length: 8 }, (_, i) => (
            <Row key={i} x={0} y={(i + 1) * 15} />
          ))}
        </pattern>
      </defs>

      <rect fill="url(#text)" stroke="black" width="100%" height="100%" />
    </svg>
  );
}

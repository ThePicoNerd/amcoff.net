"use client";

import { martianMono } from "@/app/fonts";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const t0Ref = useRef(0);

  const draw = useCallback((t: DOMHighResTimeStamp) => {
    const element = textRef.current;
    if (!element) return;

    const bytes = element.textContent!.split(" ");

    let updates = 0;
    while (updateCountRef.current < (t - t0Ref.current) * UPDATE_FREQ) {
      bytes[Math.floor(Math.random() * bytes.length)] = randomHexByte();
      updateCountRef.current++;
      updates++;

      if (updates > 10) {
        t0Ref.current = t;
        updateCountRef.current = 0;
        break;
      }
    }

    if (updates > 0) {
      element.textContent = bytes.join(" ");
    }

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
      {Array.from({ length: 16 }, () => "00").join(" ")}
    </text>
  );
}

export default function Background() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <svg className="fixed inset-0 w-full h-full -z-10">
      <defs>
        <pattern
          id="text"
          x="0"
          y="0"
          width="268.81"
          height="240"
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: 16 }, (_, i) => (
            <Row key={i} x={0} y={(i + 1) * 15} />
          ))}
        </pattern>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        className="fill-neutral-900"
      />
      <rect
        fill="url(#text)"
        stroke="black"
        width="100%"
        height="100%"
        className={classNames(
          "transition-all duration-500 origin-center ease-in-out",
          show ? "scale-100 opacity-100" : "scale-105 opacity-0",
        )}
      />
    </svg>
  );
}

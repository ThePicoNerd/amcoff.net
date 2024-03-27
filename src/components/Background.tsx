"use client";

import { martianMono } from "@/app/fonts";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

function randomHexByte() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
}

const CHANGES_PER_MS = 1;

interface Sizes {
  w: number;
  h: number;
  textHeight: number;
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const prevTimeRef = useRef<DOMHighResTimeStamp>(0);
  const [show, setShow] = useState(false);

  const sizeRef = useRef<Sizes>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    context.fillStyle = "rgb(64 64 64)";
    context.font = `24px ${martianMono.style.fontFamily}`;
    const glyphMetrics = context.measureText("0");

    const w = glyphMetrics.width * 3;
    const textHeight = glyphMetrics.actualBoundingBoxAscent;
    const h = glyphMetrics.actualBoundingBoxAscent * 1.5;

    sizeRef.current = { w, h, textHeight };

    for (let x = 0; x < canvas.width + w; x += w) {
      for (let y = 0; y < canvas.height + h; y += h) {
        context.clearRect(x, y - h, w, h);
        context.fillText("00", x, y - (h - textHeight) / 2);
      }
    }

    setShow(true);
  }, []);

  const draw = useCallback((t: DOMHighResTimeStamp) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const dt = t - prevTimeRef.current;
    prevTimeRef.current = t;

    if (sizeRef.current) {
      const { w, h, textHeight } = sizeRef.current;

      for (let i = 0; i < dt * CHANGES_PER_MS; i++) {
        const x = Math.round((Math.random() * canvas.width) / w) * w;
        const y = Math.round((Math.random() * canvas.height) / h) * h;

        context.clearRect(x, y - h, w, h);
        context.fillText(randomHexByte(), x, y - (h - textHeight) / 2);
      }
    }

    requestRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (show) {
      requestRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (typeof requestRef.current === "number") {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [draw, show]);

  return (
    <div
      className="bg-neutral-900 fixed -z-10 inset-0 overflow-hidden"
      style={{
        fontFamily: martianMono.style.fontFamily,
      }}
    >
      <canvas
        width="2000"
        height="2000"
        ref={canvasRef}
        className={classNames(
          "w-full h-full pointer-events-none object-cover object-center transition-all duration-500 ease-out",
          show ? "opacity-100 scale-100" : "opacity-0 scale-105",
        )}
      />
    </div>
  );
}

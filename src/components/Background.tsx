"use client";

import { martianMono } from "@/app/fonts";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

function randomHexByte() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
}

const CHANGES_PER_MS = 0.5;

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    // Start drawing
    context.fillStyle = "rgb(64 64 64)";
    context.font = `32px ${martianMono.style.fontFamily}`;
    const glyphMetrics = context.measureText("0");

    const w = glyphMetrics.width * 3;
    const textHeight = glyphMetrics.actualBoundingBoxAscent;
    const h = glyphMetrics.actualBoundingBoxAscent * 1.5;

    for (let x = 0; x < canvas.width; x += w) {
      for (let y = 0; y < canvas.height; y += h) {
        context.clearRect(x, y - h, w, h);
        context.fillText("00", x, y - (h - textHeight) / 2);
      }
    }

    setShow(true);

    let t0 = 0;

    const draw = (t: DOMHighResTimeStamp) => {
      const dt = t - t0;
      t0 = t;

      for (let i = 0; i < dt * CHANGES_PER_MS; i++) {
        const x = Math.round((Math.random() * canvas.width) / w) * w;
        const y = Math.round((Math.random() * canvas.height) / h) * h;

        context.clearRect(x, y - h, w, h);
        context.fillText(randomHexByte(), x, y - (h - textHeight) / 2);
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof requestRef.current === "number") {
        cancelAnimationFrame(requestRef.current);
      }
    };
  });

  return (
    <div className="bg-neutral-900 absolute -z-10 inset-0 overflow-hidden">
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

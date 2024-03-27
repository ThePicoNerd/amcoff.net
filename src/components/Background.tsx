"use client";

import { martianMono } from "@/app/fonts";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

function randomHexByte() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
}

const CHANGES_PER_MS = 0.3;

interface Sizes {
  w: number;
  h: number;
  textHeight: number;
}

export default function Background() {
  const requestRef = useRef<number>();
  const prevTimeRef = useRef<DOMHighResTimeStamp>(0);
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const sizeRef = useRef<Sizes>();

  const font = "32px " + martianMono.style.fontFamily;

  useEffect(() => {
    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.font = font;
    const glyphMetrics = context.measureText("0");

    const w = glyphMetrics.width * 3;
    const textHeight = glyphMetrics.actualBoundingBoxAscent;
    const h = glyphMetrics.actualBoundingBoxAscent * 1.5;

    sizeRef.current = { w, h, textHeight };

    canvas.width = w * 10;
    canvas.height = h * 10;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "rgb(64 64 64)";
    ctx.font = font;

    for (let x = 0; x < canvas.width + w; x += w) {
      for (let y = 0; y < canvas.height + h; y += h) {
        ctx.fillText("00", x, y - (h - textHeight) / 2);
      }
    }

    setShow(true);
  }, [canvas, font]);

  const draw = useCallback(
    (t: DOMHighResTimeStamp) => {
      if (!canvas) return;

      const context = canvas.getContext("2d");

      if (!context) return;

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

      containerRef.current!.style.backgroundImage = `url(${canvas.toDataURL(
        "image/png",
      )})`;

      requestRef.current = requestAnimationFrame(draw);
    },
    [canvas],
  );

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

  useEffect(() => {
    setCanvas(document.createElement("canvas"));
  }, []);

  return (
    <div className="bg-neutral-900 fixed -z-10 inset-0 overflow-hidden pointer-events-none">
      <div
        ref={containerRef}
        className={classNames(
          "w-full h-full bg-repeat transition-all duration-500 ease-in-out",
          show ? "opacity-100 scale-100" : "opacity-0 scale-105",
        )}
        style={{
          fontFamily: martianMono.style.fontFamily,
          backgroundSize: "200px auto",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SCALE = 0.5;
const RADIUS = 3;
const STRENGTH = 450;
const REFRACT = 2;

const RippleBg = ({ src }: { src: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !parent || !ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let initialized = false;
    let base = new Uint8ClampedArray();
    let out: ImageData;
    let a = new Int16Array(0);
    let b = new Int16Array(0);

    const setup = () => {
      if (!img.complete || !img.naturalWidth || !img.naturalHeight) {
        return;
      }

      const width = Math.round(parent.clientWidth * SCALE);
      const height = Math.round(parent.clientHeight * SCALE);

      // Prevent zero-size canvas errors
      if (width <= 0 || height <= 0) {
        initialized = false;
        return;
      }

      w = width;
      h = height;

      canvas.width = w;
      canvas.height = h;

      // Draw original image
      ctx.clearRect(0, 0, w, h);

      const ratio = Math.max(w / img.naturalWidth, h / img.naturalHeight);

      const dw = img.naturalWidth * ratio;
      const dh = img.naturalHeight * ratio;

      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);

      // Get image data only after valid dimensions
      const imageData = ctx.getImageData(0, 0, w, h);

      base = new Uint8ClampedArray(imageData.data);

      out = ctx.createImageData(w, h);
      out.data.set(base);

      a = new Int16Array(w * h);
      b = new Int16Array(w * h);

      initialized = true;
    };

    const drop = (e: PointerEvent) => {
      if (!initialized) return;

      const rect = parent.getBoundingClientRect();

      const cx = Math.round((e.clientX - rect.left) * SCALE);
      const cy = Math.round((e.clientY - rect.top) * SCALE);

      for (let y = -RADIUS; y <= RADIUS; y++) {
        for (let x = -RADIUS; x <= RADIUS; x++) {
          const px = cx + x;
          const py = cy + y;

          if (
            px > 0 &&
            px < w - 1 &&
            py > 0 &&
            py < h - 1 &&
            x * x + y * y <= RADIUS * RADIUS
          ) {
            a[py * w + px] += STRENGTH;
          }
        }
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);

      if (!visible || !initialized) return;

      // Wave propagation
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;

          const v = ((a[i - 1] + a[i + 1] + a[i - w] + a[i + w]) >> 1) - b[i];

          b[i] = v - (v >> 5);
        }
      }

      [a, b] = [b, a];

      // Image distortion
      const d = out.data;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;

          const sx = Math.min(
            w - 1,
            Math.max(0, x + ((a[i - 1] - a[i + 1]) >> REFRACT)),
          );

          const sy = Math.min(
            h - 1,
            Math.max(0, y + ((a[i - w] - a[i + w]) >> REFRACT)),
          );

          const s = (sy * w + sx) * 4;
          const o = i * 4;

          d[o] = base[s];
          d[o + 1] = base[s + 1];
          d[o + 2] = base[s + 2];
          d[o + 3] = 255;
        }
      }

      ctx.putImageData(out, 0, 0);
    };

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    const handleLoad = () => {
      setup();

      resizeObserver.observe(parent);
      intersectionObserver.observe(parent);

      if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    };

    img.onload = handleLoad;

    img.onerror = () => {
      initialized = false;
      console.error("RippleBg: Failed to load image:", src);
    };

    img.src = src;

    // Handle cached images
    if (img.complete && img.naturalWidth > 0) {
      handleLoad();
    }

    parent.addEventListener("pointermove", drop);

    return () => {
      parent.removeEventListener("pointermove", drop);

      cancelAnimationFrame(raf);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      img.onload = null;
      img.onerror = null;
      img.src = "";
    };
  }, [src]);

  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover"
      />

      <canvas
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
      />
    </>
  );
};

export default RippleBg;

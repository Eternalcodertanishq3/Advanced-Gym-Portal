"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebcamOptions {
  onScan?: (decodedText: string) => void;
  scanIntervalMs?: number;
  facingMode?: "user" | "environment";
}

/**
 * 📷 GYMFLOW — Leak-Free Webcam & Scanner Hook
 * Implements strict memory and MediaStream track garbage collection
 * to prevent Out-Of-Memory (OOM) crashes during continuous kiosk operation.
 */
export function useWebcamQR({
  onScan,
  scanIntervalMs = 250,
  facingMode = "environment",
}: UseWebcamOptions = {}) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Stop and clean up all media tracks and animation frames
  const stopStream = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore errors during track shutdown
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (isMountedRef.current) {
      setIsActive(false);
    }
  }, []);

  // Start the video stream safely
  const startStream = useCallback(async () => {
    stopStream();
    setError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported on this device or browser context.");
      setHasPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      setHasPermission(true);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }

      // Initialize persistent reusable canvas to prevent GC pressure
      if (!canvasRef.current && typeof document !== "undefined") {
        const canvas = document.createElement("canvas");
        canvasRef.current = canvas;
      }

      // Scanning loop
      const scanLoop = (timestamp: number) => {
        if (!isMountedRef.current || !streamRef.current) return;

        if (timestamp - lastScanTimeRef.current >= scanIntervalMs) {
          lastScanTimeRef.current = timestamp;

          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && canvas && video.readyState >= video.HAVE_CURRENT_DATA) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
              if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
              }
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Hook point for jsQR / BarcodeDetector API if available
              if (typeof window !== "undefined" && "BarcodeDetector" in window) {
                try {
                  const barcodeDetector = new (window as any).BarcodeDetector({
                    formats: ["qr_code"],
                  });
                  barcodeDetector
                    .detect(canvas)
                    .then((barcodes: any[]) => {
                      if (barcodes && barcodes.length > 0 && onScan) {
                        onScan(barcodes[0].rawValue);
                      }
                    })
                    .catch(() => {
                      // Ignored scanning frame error
                    });
                } catch {
                  // Fallback or unsupported format
                }
              }
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(scanLoop);
      };

      animationFrameRef.current = requestAnimationFrame(scanLoop);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const errMsg = err instanceof Error ? err.message : "Failed to access camera";
      setError(errMsg);
      setHasPermission(false);
      stopStream();
    }
  }, [facingMode, onScan, scanIntervalMs, stopStream]);

  // Teardown lifecycle listener
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopStream();
      canvasRef.current = null;
    };
  }, [stopStream]);

  return {
    videoRef,
    isActive,
    hasPermission,
    error,
    startStream,
    stopStream,
  };
}

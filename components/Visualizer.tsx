import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ stream, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!stream || !isActive || !canvasRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Cleanup previous source
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Low resolution for the "bars" look
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!isActive) return;
        rafRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        // Clear
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height;

          // Gradient fill
          const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.4)');

          canvasCtx.fillStyle = gradient;
          
          // Rounded bars logic (simple rect for now)
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 2;
        }
      };

      draw();

    } catch (err) {
      console.error("Audio visualizer error:", err);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stream, isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={60} 
      className="w-full h-full opacity-80"
    />
  );
};
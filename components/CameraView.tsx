import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CameraViewProps {
  stream: MediaStream | null;
  isActive: boolean;
  isAnalyzing: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ stream, isActive, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Simulate analysis overlay
  useEffect(() => {
    if (!isActive || !isAnalyzing || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame: number;

    const draw = () => {
      if (!ctx || !videoRef.current) return;
      
      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw simulated face landmarks or tracking box
      const time = Date.now() / 1000;
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      
      // Animated reticle
      const width = 200;
      const height = 250;
      const x = (canvas.width - width) / 2 + Math.sin(time) * 10;
      const y = (canvas.height - height) / 2 + Math.cos(time * 1.5) * 5;

      // Draw corners
      const cornerSize = 20;
      ctx.beginPath();
      // Top Left
      ctx.moveTo(x, y + cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerSize, y);
      // Top Right
      ctx.moveTo(x + width - cornerSize, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + cornerSize);
      // Bottom Right
      ctx.moveTo(x + width, y + height - cornerSize);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width - cornerSize, y + height);
      // Bottom Left
      ctx.moveTo(x + cornerSize, y + height);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x, y + height - cornerSize);
      ctx.stroke();

      // Analyzing text
      ctx.font = '12px Space Grotesk';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.fillText(`TRACKING [${(Math.random() * 100).toFixed(0)}%]`, x, y - 10);

      animationFrame = requestAnimationFrame(draw);
    };

    // Set canvas size to match video (simulated for responsive container)
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    
    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, isAnalyzing]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black">
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          <p>Camera inactive</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-1000 ${stream ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: 'scaleX(-1)' }} // Mirror effect
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: 'scaleX(-1)' }} // Mirror match
      />
      
      {/* Overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      
      {/* Recording Indicator */}
      {isAnalyzing && (
        <motion.div 
          className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-red-200 uppercase tracking-wider">Live Analysis</span>
        </motion.div>
      )}
    </div>
  );
};

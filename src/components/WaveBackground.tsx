
import React, { useEffect, useRef } from 'react';

const LightningBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Update canvas dimensions
    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    // Lightning parameters
    const lightningColors = [
      'rgba(29, 78, 216, 0.2)',   // Deep Blue
      'rgba(59, 130, 246, 0.15)', // Bright Blue
      'rgba(250, 204, 21, 0.1)'   // Signal Yellow
    ];
    
    const drawLightning = (startX: number, startY: number, endX: number, endY: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create jagged lightning path
      let currentX = startX;
      let currentY = startY;
      const segments = 10;
      
      for (let i = 0; i < segments; i++) {
        const progress = (i + 1) / segments;
        const randomOffset = Math.random() * 50 * (1 - progress);
        
        currentX += (endX - startX) / segments + (Math.random() - 0.5) * randomOffset;
        currentY += (endY - startY) / segments + (Math.random() - 0.5) * randomOffset;
        
        ctx.lineTo(currentX, currentY);
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    };
    
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Randomly generate lightning bolts
      if (Math.random() < 0.05) {
        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = canvas.height;
        
        const color = lightningColors[Math.floor(Math.random() * lightningColors.length)];
        drawLightning(startX, startY, endX, endY, color);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default LightningBackground;

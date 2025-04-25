
import React, { useEffect, useRef } from 'react';

const WaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Update canvas dimensions on mount and window resize
    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    // Handle mouse movement to influence waves
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Wave parameters
    const waves = [
      { y: canvas.height * 0.25, amplitude: 30, frequency: 0.02, speed: 0.05, color: 'rgba(29, 78, 216, 0.2)' },
      { y: canvas.height * 0.4, amplitude: 25, frequency: 0.01, speed: 0.03, color: 'rgba(29, 78, 216, 0.15)' },
      { y: canvas.height * 0.55, amplitude: 35, frequency: 0.015, speed: 0.02, color: 'rgba(29, 78, 216, 0.1)' },
      { y: canvas.height * 0.7, amplitude: 20, frequency: 0.025, speed: 0.04, color: 'rgba(250, 204, 21, 0.1)' },
      { y: canvas.height * 0.85, amplitude: 25, frequency: 0.012, speed: 0.06, color: 'rgba(250, 204, 21, 0.15)' },
    ];
    
    let phase = 0;
    
    // Animation function
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Responsive waves based on mouse position
      const mouseInfluence = {
        x: (mouseX / canvas.width) * 2 - 1,
        y: (mouseY / canvas.height) * 2 - 1
      };
      
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);
        
        // Draw wave
        for (let x = 0; x < canvas.width; x++) {
          // Calculate wave height with mouse influence
          const distanceToMouse = Math.abs(x - mouseX) / canvas.width;
          const mouseEffect = (1 - Math.min(1, distanceToMouse * 3)) * 15 * mouseInfluence.y;
          
          const y = wave.y + 
                   Math.sin(x * wave.frequency + phase * wave.speed) * wave.amplitude +
                   mouseEffect;
          
          ctx.lineTo(x, y);
        }
        
        // Complete the wave path
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Fill wave
        ctx.fillStyle = wave.color;
        ctx.fill();
      });
      
      phase += 0.1; // Increment phase for animation
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default WaveBackground;

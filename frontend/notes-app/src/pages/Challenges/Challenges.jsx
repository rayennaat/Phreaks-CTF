import React, { useState, useEffect, useRef } from 'react';
import UserBar from "../../components/UserBar/UserBar";
import TaskCard from "../../components/Cards/ScrambleButton";

const ChallengesPage = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create dots with better visibility
    const dots = [];
    const dotCount = Math.floor((canvas.width * canvas.height) / 12000); // Slightly more dots
    
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.8, // Slightly larger dots
        speedX: Math.random() * 0.2 - 0.1, // Maintains smooth speed
        speedY: Math.random() * 0.2 - 0.1,
        originalX: Math.random() * canvas.width,
        originalY: Math.random() * canvas.height
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw dots
      dots.forEach(dot => {
        // Gentle movement with tendency to return to original position
        dot.x += (dot.originalX - dot.x) * 0.005 + dot.speedX;
        dot.y += (dot.originalY - dot.y) * 0.005 + dot.speedY;
        
        // Draw dot with better visibility
        ctx.fillStyle = 'rgba(120, 120, 255, 0.5)'; // More visible color
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect dots that are close to each other
        dots.forEach(otherDot => {
          if (dot === otherDot) return;
          
          const distance = Math.sqrt(
            Math.pow(dot.x - otherDot.x, 2) + 
            Math.pow(dot.y - otherDot.y, 2)
          );
          
          if (distance < 120) { // Slightly increased connection distance
            const opacity = 0.6 - distance/200; // More visible connections
            ctx.strokeStyle = `rgba(150, 150, 255, ${opacity})`;
            ctx.lineWidth = 0.5; // Slightly thicker lines
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        });
        
        // Connect dots to mouse if close (more visible interaction)
        if (mousePosition.x && mousePosition.y) {
          const mouseDistance = Math.sqrt(
            Math.pow(dot.x - mousePosition.x, 2) + 
            Math.pow(dot.y - mousePosition.y, 2)
          );
          
          if (mouseDistance < 180) {
            const opacity = 0.7 - mouseDistance/250;
            ctx.strokeStyle = `rgba(200, 200, 255, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mousePosition.x, mousePosition.y);
            ctx.stroke();
            
            // Gentle push effect from mouse
            dot.x += (mousePosition.x - dot.x) * -0.0005;
            dot.y += (mousePosition.y - dot.y) * -0.0005;
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Mouse movement handler
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition]);

  return (
    <div className="bg-[#121212] min-h-screen pb-1 relative overflow-hidden">
      {/* Canvas background with better visibility */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80"
      />
      
      {/* Content */}
      <div className="relative z-10">
        <UserBar />
        <div className="max-w-6xl px-4 pt-32 mx-auto sm:px-6 lg:px-8">
          <h1 className="mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
            CHALLENGES
          </h1>
          <TaskCard />
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
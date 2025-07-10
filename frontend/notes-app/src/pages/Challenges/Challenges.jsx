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
    
    // Create dots
    const dots = [];
    const dotCount = Math.floor((canvas.width * canvas.height) / 15000); // Reduced density
    
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5, // Smaller dots
        speedX: Math.random() * 0.2 - 0.1, // Slower movement
        speedY: Math.random() * 0.2 - 0.1, // Slower movement
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw dots
      dots.forEach(dot => {
        // Move dots (slower movement)
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        
        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.speedY *= -1;
        
        // Draw dot (more subtle)
        ctx.fillStyle = 'rgba(100, 100, 255, 0.3)'; // More transparent
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect dots that are close to each other
        dots.forEach(otherDot => {
          const distance = Math.sqrt(
            Math.pow(dot.x - otherDot.x, 2) + 
            Math.pow(dot.y - otherDot.y, 2)
          );
          
          if (distance < 100) { // Reduced connection distance
            ctx.strokeStyle = `rgba(100, 100, 255, ${0.3 - distance/300})`; // More subtle
            ctx.lineWidth = 0.3; // Thinner lines
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        });
        
        // Connect dots to mouse if close
        if (mousePosition.x && mousePosition.y) {
          const mouseDistance = Math.sqrt(
            Math.pow(dot.x - mousePosition.x, 2) + 
            Math.pow(dot.y - mousePosition.y, 2)
          );
          
          if (mouseDistance < 150) { // Reduced mouse interaction distance
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - mouseDistance/375})`; // More subtle
            ctx.lineWidth = 0.4; // Thinner lines
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mousePosition.x, mousePosition.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle mouse movement
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
      {/* Canvas background - added blur for smoother effect */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-70"
        style={{ filter: 'blur(1px)' }}
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
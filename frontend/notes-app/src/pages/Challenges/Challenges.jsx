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
    const dotCount = Math.floor((canvas.width * canvas.height) / 10000); // Adjust density
    
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5, // Smaller dots
        speedX: Math.random() * 0.2 - 0.1, // Slower movement
        speedY: Math.random() * 0.2 - 0.1,
        originalX: null,
        originalY: null
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw dots
      dots.forEach(dot => {
        // Store original position if not set
        if (dot.originalX === null) dot.originalX = dot.x;
        if (dot.originalY === null) dot.originalY = dot.y;
        
        // Gentle movement towards original position
        if (mousePosition.x && mousePosition.y) {
          const dx = mousePosition.x - dot.x;
          const dy = mousePosition.y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only react when mouse is somewhat close
          if (distance < 250) {
            // Move away from mouse gently (slower reaction)
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (250 - distance) / 250 * 0.5; // Reduced force
            
            dot.x -= forceDirectionX * force * 0.3; // Slower reaction
            dot.y -= forceDirectionY * force * 0.3;
          } else {
            // Return to original position slowly
            dot.x += (dot.originalX - dot.x) * 0.02;
            dot.y += (dot.originalY - dot.y) * 0.02;
          }
        } else {
          // Normal random movement when mouse isn't active
          dot.x += dot.speedX;
          dot.y += dot.speedY;
        }
        
        // Bounce off edges gently
        if (dot.x < 0 || dot.x > canvas.width) dot.speedX *= -0.8;
        if (dot.y < 0 || dot.y > canvas.height) dot.speedY *= -0.8;
        
        // Draw dot
        ctx.fillStyle = 'rgba(150, 100, 255, 0.6)'; // Keep your purple color
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
          
          if (distance < 120) { // Slightly shorter connection distance
            ctx.strokeStyle = `rgba(150, 100, 255, ${0.7 - distance/120})`; // Purple connections
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        });
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
      {/* Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
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
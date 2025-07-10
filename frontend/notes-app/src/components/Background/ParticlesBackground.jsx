import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const targetMouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create dots
    const dots = [];
    const dotCount = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouse.current.x == null) {
        mouse.current.x = targetMouse.current.x;
        mouse.current.y = targetMouse.current.y;
      } else {
        mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.1;
        mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.1;
      }

      dots.forEach(dot => {
        // Attraction to mouse
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dx = mouse.current.x - dot.x;
          const dy = mouse.current.y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const force = (200 - distance) / 200;
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * force * 0.5;
            const moveY = Math.sin(angle) * force * 0.5;
            dot.x += moveX;
            dot.y += moveY;
          }
        }

        dot.x += dot.speedX;
        dot.y += dot.speedY;

        if (dot.x < 0 || dot.x > canvas.width) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.speedY *= -1;

        // Draw dot
        ctx.fillStyle = 'rgba(100, 100, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect to other dots
        dots.forEach(other => {
          const dist = Math.hypot(dot.x - other.x, dot.y - other.y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(100, 100, 255, ${1 - dist / 150})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Connect to mouse
        if (mouse.current.x != null && mouse.current.y != null) {
          const distToMouse = Math.hypot(dot.x - mouse.current.x, dot.y - mouse.current.y);
          if (distToMouse < 200) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distToMouse / 200})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      targetMouse.current.x = e.clientX;
      targetMouse.current.y = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticlesBackground;

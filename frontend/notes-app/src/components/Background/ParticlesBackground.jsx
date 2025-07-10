import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null, radius: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const numberOfParticles = 100;

    class Particle {
      constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = "#ffffff44";
        ctx.fill();
      }

      update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        // Mouse interaction
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.current.radius) {
          if (mouse.current.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 3;
          }
          if (mouse.current.x > this.x && this.x > this.size * 10) {
            this.x -= 3;
          }
          if (mouse.current.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 3;
          }
          if (mouse.current.y > this.y && this.y > this.size * 10) {
            this.y -= 3;
          }
        }

        this.draw();
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        let size = 2;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() - 0.5) * 1.5;
        let directionY = (Math.random() - 0.5) * 1.5;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff22";
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((particle) => particle.update());
      connectParticles();
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleMouseMove = (e) => {
      mouse.current.x = e.x;
      mouse.current.y = e.y;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%", background: "#121212" }}
    />
  );
};

export default ParticlesBackground;

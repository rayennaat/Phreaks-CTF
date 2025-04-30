import React from "react";
import { motion } from "framer-motion";
import black from "../../assets/images/black-noise.png";
import phreaks from "../../assets/images/Phreaks.png";
import freaks from "../../assets/images/freaks-mascott.png";

const FuzzyOverlayExample = () => {
  return (
    <div className="relative overflow-hidden">
      <ExampleContent />
      <FuzzyOverlay />
    </div>
  );
};

const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: `url(${black})`,
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
    />
  );
};

const ExampleContent = () => {
  return (
    <div className="relative grid h-screen p-8 space-y-6 place-content-center bg-neutral-950">
      <img src={phreaks} alt="Phreaks Logo" />
      <h1 className="text-center text-neutral-400">
        ARE YOU READY TO START <b className="">PWNING?</b> 📺
      </h1><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      
      {/* Mascot container - now at bottom center */}
      <div className="absolute left-0 right-0 flex justify-center bottom-1">
        <img 
          src={freaks} 
          alt="Freaks Mascot" 
          className="w-[250px] h-auto" // Adjust size as needed
        />
      </div>
    </div>
  );
};

export default FuzzyOverlayExample;
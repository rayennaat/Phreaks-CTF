import React from "react";
import { motion } from "framer-motion";
import black from "../../assets/images/black-noise.png"
import noise from "../../assets/images/noise.png"
import phreaks from "../../assets/images/Phreaks.png"
import favicon from "../../assets/images/favicon.png"


const FuzzyOverlayExample = () => {
  return (
    // NOTE: An overflow of hidden will be required on a wrapping
    // element to see expected results
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
      // You can download these PNGs here:
      // https://www.hover.dev/black-noise.png
      // https://www.hover.dev/noise.png
      style={{
        backgroundImage: `url(${black})`,
        // backgroundImage: 'url("/noise.png")',
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
    />
  );
};

const ExampleContent = () => {
  return (
    <div className="relative grid h-screen p-8 space-y-6 place-content-center bg-neutral-950">
      <img src={phreaks} alt="" />
      <h1 className="text-center text-neutral-400">
        ARE YOU READY TO START <b className="">PWNING?</b> 📺
      </h1>
      
      <div className="flex items-center justify-center gap-3">
      <img src={favicon} alt="" />
      </div>
    </div>
  );
};

export default FuzzyOverlayExample;
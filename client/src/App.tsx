import React from 'react';
import { Link } from 'react-router-dom';
import { BackgroundBeams } from "./components/ui/background-beams";

import './App.css';
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';
import { AuroraBackground } from './components/ui/aurora-background';
import { motion } from 'framer-motion';

function App() {

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          AI Card Cutter
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Card cutting made easier.
        </div>
        <Link to="/form">
          <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
            Get Started
          </button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}

export default App;

import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(10px)",
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 1.02,
        filter: "blur(10px)",
    },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;

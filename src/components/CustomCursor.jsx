import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useSpring(0, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("button, a, .glass-card")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        translateX: mouseX,
        translateY: mouseY,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        scale: isHovering ? 3 : 1,
        backgroundColor: isHovering ? "rgba(15, 23, 42, 0.05)" : "rgba(15, 23, 42, 1)",
        border: isHovering ? "1px solid rgba(15, 23, 42, 0.1)" : "0px solid transparent",
      }}
      className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
    />
  );
}

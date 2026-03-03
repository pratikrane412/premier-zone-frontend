import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Activity, Users, Globe } from "lucide-react";
import logo from "../assets/logo1.png";

export default function Home() {
  // 1. 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Degrees of rotation (max 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  };

  return (
    <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden bg-white">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content Column */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="space-y-8 text-center lg:text-left z-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm"
          >
            <Activity size={14} className="text-brand-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">
              2024/25 Season Analytics
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9]"
          >
            The Pitch. <br />{" "}
            <span className="text-gradient italic">Reimagined.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Experience the Premier League through a lens of high-fidelity data.
            Track efficiency, tactical mastery, and global impact.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6"
          >
            <button className="group flex items-center justify-center gap-3 px-8 py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-2xl shadow-brand-primary/20 hover:bg-brand-accent transition-all duration-300 active:scale-95">
              Start Exploring{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <a
              href="/teams"
              className="px-8 py-5 bg-white text-brand-primary font-bold border-2 border-slate-100 rounded-2xl hover:border-brand-primary/20 hover:bg-slate-50 transition-all duration-300 text-center"
            >
              View Clubs
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center lg:justify-start gap-12 pt-12 border-t border-slate-100"
          >
            <div className="space-y-1">
              <p className="text-3xl font-black text-brand-primary flex items-center gap-2">
                <Users size={20} /> 500+
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Active Players
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-brand-primary flex items-center gap-2">
                <Globe size={20} /> 60+
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nations
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual Column (Modern 3D Tilt Animation) */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex justify-center items-center isolate py-20 cursor-pointer group"
          style={{ perspective: "1000px" }} // Added 3D depth context
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-[480px] flex justify-center items-center"
          >
            {/* Background Shield with "Shadow Depth" */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-[4rem] blur-2xl -z-10 translate-z-[-20px]"></div>

            {/* The Main Glass Container */}
            <div className="absolute inset-0 bg-white border border-slate-100 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.07)] -z-20 translate-z-[-10px]"></div>

            {/* The Logo with Shine Effect */}
            <div className="relative overflow-hidden rounded-[4rem] p-12">
              {/* Animated Shine/Glint */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] z-20 pointer-events-none"
              />

              <img
                src={logo}
                alt="Premier League Logo"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative z-10 will-change-transform select-none"
                style={{ backfaceVisibility: "hidden" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

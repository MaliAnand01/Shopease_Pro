import { motion } from "framer-motion";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`relative overflow-hidden bg-black/5 dark:bg-white/5 rounded-xl ${className}`}
      {...props}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent w-1/2"
      />
    </div>
  );
};

export default Skeleton;

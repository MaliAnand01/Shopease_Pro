import React from "react";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-black/5 dark:bg-white/10 rounded-xl ${className}`}
      {...props}
    />
  );
};

export default Skeleton;

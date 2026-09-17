import React from "react";

interface LoaderGridProps {
  className?: string;
  size?: string;
}

const LoaderGrid: React.FC<LoaderGridProps> = ({ className = "", size }) => {
  return (
    <div
      className={`relative w-[2.5em] h-[2.5em] rotate-[165deg] ${className}`}
      style={size ? { fontSize: size } : undefined}
    >
      <span className="beforeEl" />
      <span className="afterEl" />
    </div>
  );
};

export default LoaderGrid;

import React from "react";
import "./loader.scss";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
  className?: string; // Allow custom classes
  fullScreen?: boolean; // For page-level loading
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "primary",
  className = "",
  fullScreen = false,
}) => {
  return (
    <div
      className={`loader-container ${
        fullScreen ? "full-screen" : ""
      } ${className}`}
    >
      <div className={`spinner ${size} ${color}`} role="status">
        {/* <span className="sr-only">Loading...</span> */}
      </div>
    </div>
  );
};

import React from "react";
const GradientTitle.FC<{ title; className? }> = ({
  title,
  className,
}) => (
  <div
    className={`font-figtree font-semibold text-center ${className}`}
    style={{
      background: "linear-gradient(to right, #7E84A5, #F1F2F4, #7E84A5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {title}
  </div>
);

export default GradientTitle;

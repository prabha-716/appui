import React from "react";

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-xl shadow-md overflow-hidden ${className}`}>{children}</div>
);

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

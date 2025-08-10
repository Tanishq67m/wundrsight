import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  return <Loader2 className={`${sizes[size]} animate-spin`} />;
}

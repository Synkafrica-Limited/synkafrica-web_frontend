"use client";

import { useEffect, useState } from "react";

export default function LottiePlayer({ src, loop = true, autoplay = true, style }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Import the player component only on the client side
    import("@dotlottie/player-component");
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={style} className="bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <dotlottie-player
      src={src}
      loop={loop}
      autoplay={autoplay}
      style={style}
    ></dotlottie-player>
  );
}

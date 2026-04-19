"use client";

import dynamic from "next/dynamic";

const MarsGlobe = dynamic(() => import("@/components/MarsGlobe"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

export default function MarsBackgroundWrapped() {
  return <MarsGlobe />;
}

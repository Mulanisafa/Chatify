import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Watermark */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex: 0,
          color: "[#6464DD]",
          fontSize: "2rem",
          fontWeight: "bold",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
          <h2 className="text-7xl font-bold">Chatify</h2>
          <p className="text-lg text-center">A Real-Time Chat Application</p>
          <Link
            style={{ pointerEvents: "visible" }}
            href="https://www.linkedin.com/in/md-imran-sheikh-bd/"
            target="_blank"
            className=" transition"
          >
            By MD IMRAN SHEIKH
          </Link>

          <h3>Click Chat for Continue</h3>
        </div>
      </div>

      {/* Main Content */}
    </div>
  );
}

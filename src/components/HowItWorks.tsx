"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

import a from "@/assets/1.png";
import b from "@/assets/2.png";
import c from "@/assets/3.png";

const content = [
  {
    title: "Step 1: Get Started",
    description:
      "Open the front page of BhoomiPath and click 'Get Started' to begin your Life Cycle Assessment journey.",
    content: (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={b}
          alt="Step 1 preview"
          className="h-full w-full object-cover"
        />
      </div>
    ),
  },
  {
    title: "Step 2: Login",
    description:
      "Sign in securely with your credentials to access your personalized dashboard and tools.",
    content: (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={c}
          alt="Step 2 preview"
          className="h-full w-full object-cover"
        />
      </div>
    ),
  },
  {
    title: "Step 3: Perform LCA with EcoSathi",
    description:
      "Use the EcoSathi chatbot to perform Life Cycle Assessment quickly, intuitively, and interactively.",
    content: (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={a}
          alt="Step 3 preview"
          className="h-full w-full object-cover"
        />
      </div>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-card/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="earthster-text-gradient">HOW IT WORKS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow these three simple steps to get started with BhoomiPath.
          </p>
        </div>

        {/* StickyScroll usage */}
        <div className="max-w-5xl mx-auto">
          <StickyScroll content={content} />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

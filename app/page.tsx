
import Navbar from "@/components/landing/Navbar";
import ScrollBackground from "@/components/landing/ScrollBackground";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden isolate text-white">
      <ScrollBackground />

      <div className="relative z-10">
        <Navbar />

        <Hero />

        <Features />

        <HowItWorks />

        <UseCases />

        <Pricing />

        <CTA />

        <Footer />
      </div>
    </main>
  );
}

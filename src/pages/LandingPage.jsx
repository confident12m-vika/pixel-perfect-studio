import { LanguageProvider } from "../context/LanguageContext";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Benefits from "../components/Benefits";
import WhyUs from "../components/WhyUs";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import Audit from "../components/Audit";
import FinalCta from "../components/FinalCta";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export default function LandingPage() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <WhyUs />
        <Portfolio />
        <Process />
        <Audit />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </LanguageProvider>
  );
}

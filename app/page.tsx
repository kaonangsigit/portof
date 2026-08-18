import HeroRedesigned from "@/components/HeroRedesigned";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import GitHubSection from "@/components/github/GitHubSection";
import Achievements from "@/components/Achievements";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Certificates from "@/components/Certificates";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroRedesigned />
      <About />
      <Stats />
      <Experience />
      <Education />
      <GitHubSection />
      <Certificates />
      <Achievements />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}

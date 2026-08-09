import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import EnergyPredictor from './sections/EnergyPredictor';
import OptimizeSection from './sections/OptimizeSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-background">
        <Navbar />
        <Hero />
        <EnergyPredictor />
        <OptimizeSection />
        <Footer />
      </div>
    </MotionConfig>
  );
}

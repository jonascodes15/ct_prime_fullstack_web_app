import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import PriceTicker from '../components/home/PriceTicker';
import FeatureSection from '../components/home/FeatureSection';
import MarketTable from '../components/home/MarketTable';
import MarqueeBars from '../components/common/MarqueeBars';
import FOMOPopup from '../components/common/FOMOPopup';

export default function Home() {
  return (
    <div className="home-page">
      <MarqueeBars />
      <Navbar />
      <HeroSection />
      <PriceTicker />
      <FeatureSection />
      <MarketTable />
      <Footer />
      <FOMOPopup />
    </div>
  );
}

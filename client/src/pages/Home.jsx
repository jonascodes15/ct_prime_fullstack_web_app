import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import PriceTicker from '../components/home/PriceTicker';
import FeatureSection from '../components/home/FeatureSection';
import MarketTable from '../components/home/MarketTable';

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <PriceTicker />
      <FeatureSection />
      <MarketTable />
      <Footer />
    </div>
  );
}

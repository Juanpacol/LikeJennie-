import CollectionCards from "../../components/home/CollectionCards";
import FaqSection from "../../components/home/FaqSection";
import HeroCurtain from "../../components/home/HeroCurtain";
import JennieHero from "../../components/home/JennieHero";
import PosterLookbook from "../../components/home/PosterLookbook";
import ShopTabs from "../../components/home/ShopTabs";

function Home() {
  return (
    <HeroCurtain hero={<JennieHero />}>
      <CollectionCards />
      <PosterLookbook />
      <ShopTabs />
      <FaqSection />
    </HeroCurtain>
  );
}

export default Home;

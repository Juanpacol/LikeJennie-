import CollectionCards from "../../components/home/CollectionCards";
import FaqSection from "../../components/home/FaqSection";
import JennieHero from "../../components/home/JennieHero";
import PosterLookbook from "../../components/home/PosterLookbook";
import ShopTabs from "../../components/home/ShopTabs";

function Home() {
  return (
    <>
      <JennieHero />
      <CollectionCards />
      <PosterLookbook />
      <ShopTabs />
      <FaqSection />
    </>
  );
}

export default Home;

import CategoryCards from "../../components/home/CategoryCards";
import FaqSection from "../../components/home/FaqSection";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import JennieHero from "../../components/home/JennieHero";
import CollectionCards from "../../components/home/CollectionCards";

function Home() {
  return (
    <>
      <JennieHero />
      <CollectionCards />
      <CategoryCards />
      <FeaturedProducts />
      <FaqSection />
    </>
  );
}

export default Home;

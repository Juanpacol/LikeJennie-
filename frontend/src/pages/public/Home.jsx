import CategoryCards from "../../components/home/CategoryCards";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import JennieHero from "../../components/home/JennieHero";
import PromoBand from "../../components/home/PromoBand";

function Home() {
  return (
    <>
      <JennieHero />
      <PromoBand />
      <CategoryCards />
      <FeaturedProducts />
    </>
  );
}

export default Home;

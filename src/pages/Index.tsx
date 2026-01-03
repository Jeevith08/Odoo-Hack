import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { PopularDestinations } from "@/components/sections/PopularDestinations";
import { RecentTrips } from "@/components/sections/RecentTrips";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PopularDestinations />
      <RecentTrips />
    </Layout>
  );
};

export default Index;

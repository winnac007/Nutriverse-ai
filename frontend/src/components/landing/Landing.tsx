import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Journeys } from "./Journeys";
import { Healthcare } from "./Healthcare";
import { Fitness } from "./Fitness";
import { Discover } from "./Discover";
import { Recipes } from "./Recipes";
import { Personalize } from "./Personalize";
import { Library } from "./Library";
import { Pricing } from "./Pricing";
import { Waitlist } from "./Waitlist";
import { Footer } from "./Footer";

export function Landing() {
  return (
    <main className="bg-ivory text-espresso overflow-x-hidden">
      <Nav />
      <Hero />
      <Journeys />
      <Healthcare />
      <Fitness />
      <Discover />
      <Recipes />
      <Personalize />
      <Library />
      <Pricing />
      <Waitlist />
      <Footer />
    </main>
  );
}

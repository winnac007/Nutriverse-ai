import Link from "next/link";

import {
  ChevronIcon,
  CulinaryPage,
  CulinaryShell,
  ScreenHeader,
} from "@/components/culinary/CulinaryPrimitives";

import styles from "./page.module.css";

const categories = [
  {
    title: "Explore by Country",
    subtitle: "Discover foods around the world",
    href: "/app/explore#countries",
    image: "/landing/map-dark.jpg",
  },
  {
    title: "Explore by Cuisine",
    subtitle: "Dive into global cuisines",
    href: "/app/explore?focus=cuisine",
    image: "/landing/journey-discover.jpg",
  },
  {
    title: "Seasonal Collections",
    subtitle: "Eat with every season",
    href: "/app/explore?search=seasonal",
    image: "/landing/hero-bowl.jpg",
  },
  {
    title: "Explore by Meal",
    subtitle: "Find recipes for every moment",
    href: "/app/explore?search=dinner",
    image: "/landing/healthcare-bowl.jpg",
  },
  {
    title: "Explore by Taste",
    subtitle: "From spicy to sweet",
    href: "/app/explore?search=spicy",
    image: "/landing/dish-morocco.jpg",
  },
  {
    title: "Explore by Ingredient",
    subtitle: "Find by what you love",
    href: "/app/explore?search=tomato",
    image: "/landing/dish-greece.jpg",
  },
  {
    title: "Trending Around the World",
    subtitle: "What’s popular right now",
    href: "/app/explore?focus=trending",
    image: "/landing/discover-bowl.jpg",
  },
  {
    title: "Continue Exploring",
    subtitle: "Pick up where you left off",
    href: "/app/explore",
    image: "/landing/dish-india.jpg",
  },
] as const;

export default function CulinaryCategoriesPage() {
  return (
    <CulinaryPage>
      <CulinaryShell narrow>
        <ScreenHeader title="Categories" backHref="/app/explore" />

        <main className={styles.list}>
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className={styles.row}>
              <img src={category.image} alt="" aria-hidden="true" />
              <span className={styles.copy}>
                <strong>{category.title}</strong>
                <span>{category.subtitle}</span>
              </span>
              <span className={styles.chevron}><ChevronIcon /></span>
            </Link>
          ))}
        </main>
      </CulinaryShell>
    </CulinaryPage>
  );
}

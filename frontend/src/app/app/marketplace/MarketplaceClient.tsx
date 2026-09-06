"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseMedical,
  Check,
  FlaskConical,
  Gift,
  Heart,
  LayoutGrid,
  Leaf,
  Search,
  ShoppingCart,
  Star,
  Stethoscope,
  Truck,
} from "lucide-react";
import styles from "./Marketplace.module.css";

interface Product {
  id: string;
  badge: "Best Seller" | "New" | "Popular";
  badgeClass: string;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  focus: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "pcos-kit",
    badge: "Best Seller",
    badgeClass: styles.badgeBestSeller,
    image: "/app-ui/market-prod-pcos.png",
    title: "PCOS Support Kit",
    description: "Nourish hormones, improve cycles & overall well-being.",
    price: 1699,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 128,
    focus: ["PCOS Support", "Hormonal Balance"],
  },
  {
    id: "thyroid-kit",
    badge: "New",
    badgeClass: styles.badgeNew,
    image: "/app-ui/market-prod-thyroid.png",
    title: "Thyroid Care Kit",
    description: "Support thyroid function & boost natural energy.",
    price: 1599,
    originalPrice: 1899,
    rating: 4.5,
    reviews: 96,
    focus: ["Hormonal Balance", "Weight Management"],
  },
  {
    id: "gut-health-kit",
    badge: "Popular",
    badgeClass: styles.badgePopular,
    image: "/app-ui/market-prod-gut.png",
    title: "Gut Health Kit",
    description: "Heal gut, reduce bloating & improve digestion.",
    price: 1499,
    originalPrice: 1799,
    rating: 4.7,
    reviews: 142,
    focus: ["Gut Health", "Weight Management"],
  },
];

const FOCUS_PILLS = [
  "PCOS Support",
  "Gut Health",
  "Hormonal Balance",
  "Weight Management",
  "Skin Health",
];

export default function MarketplaceClient() {
  const router = useRouter();
  const [selectedFocus, setSelectedFocus] = useState<string>("PCOS Support");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    showToast(`✓ Added ${product.title} to cart`);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from saved items");
      } else {
        next.add(id);
        showToast("Saved to favorites ♡");
      }
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.topNav}>
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className={styles.pageTitle}>Healthcare Marketplace</h1>
        <div className={styles.cartBtnWrapper}>
          <button
            className={styles.cartBtn}
            onClick={() => showToast(cartCount > 0 ? `You have ${cartCount} items in your cart` : "Your cart is empty")}
            aria-label="Cart"
          >
            <ShoppingCart size={19} />
          </button>
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            Wellness,<br />beyond the plate
          </h2>
          <p className={styles.heroSubtitle}>
            Curated kits and Ayurvedic essentials to support your health naturally.
          </p>
        </div>
        <div className={styles.heroVisualWrapper}>
          <img
            src="/app-ui/market-hero-plate.png"
            alt="Ayurvedic essentials and herbal tea"
            className={styles.heroPlateImg}
          />
        </div>
      </section>

      {/* Search and Categories Bar */}
      <div className={styles.searchBarRow}>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for kits, herbs, teas and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button
          className={styles.categoriesBtn}
          onClick={() => showToast("Categories: Healthcare Kits, Ayurveda, Teas, Supplements")}
        >
          <LayoutGrid size={16} />
          <span>Categories</span>
        </button>
      </div>

      {/* Two Major Feature Cards */}
      <div className={styles.featureGrid}>
        {/* Card 1: Healthcare Kits */}
        <div className={styles.featureCard}>
          <div>
            <div className={styles.catIconBadgeKits}>
              <BriefcaseMedical size={19} />
            </div>
            <h3 className={`${styles.featureCardTitle} ${styles.titleKits}`}>
              Healthcare Kits
            </h3>
            <p className={styles.featureCardDesc}>
              Doctor-inspired kits for specific health goals and conditions.
            </p>
            <button
              className={`${styles.explorePillBtn} ${styles.btnKits}`}
              onClick={() => setSelectedFocus("PCOS Support")}
            >
              Explore Kits <ArrowRight size={13} />
            </button>
          </div>
          <div className={styles.featureVisualWrap}>
            <img
              src="/app-ui/market-box-kits.png"
              alt="Healthcare kits box"
              className={styles.featureVisualImg}
            />
          </div>
        </div>

        {/* Card 2: Ayurveda & Wellness */}
        <div className={styles.featureCard}>
          <div>
            <div className={styles.catIconBadgeAyurveda}>
              <Leaf size={19} />
            </div>
            <h3 className={`${styles.featureCardTitle} ${styles.titleAyurveda}`}>
              Ayurveda &amp; Wellness
            </h3>
            <p className={styles.featureCardDesc}>
              Traditional Ayurvedic products to support balance and vitality.
            </p>
            <button
              className={`${styles.explorePillBtn} ${styles.btnAyurveda}`}
              onClick={() => setSelectedFocus("Gut Health")}
            >
              Explore Ayurveda <ArrowRight size={13} />
            </button>
          </div>
          <div className={styles.featureVisualWrap}>
            <img
              src="/app-ui/market-vis-ayurveda.png"
              alt="Ayurvedic herbs and mortar"
              className={styles.featureVisualImg}
            />
          </div>
        </div>
      </div>

      {/* Recommended for your focus Section */}
      <section className={styles.focusSection}>
        <div className={styles.focusHeaderRow}>
          <h2 className={styles.sectionHeading}>Recommended for your focus</h2>
          <span
            className={styles.viewAllLink}
            onClick={() => showToast("Browsing all curated wellness kits")}
          >
            View all <ArrowRight size={14} />
          </span>
        </div>

        {/* Focus Filter Pills */}
        <div className={styles.pillRail} role="tablist" aria-label="Health Focus Filters">
          {FOCUS_PILLS.map((pill) => {
            const isActive = selectedFocus === pill;
            return (
              <button
                key={pill}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedFocus(pill)}
                className={`${styles.focusPill} ${isActive ? styles.activeFocusPill : ""}`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Product Cards Rail */}
        <div className={styles.productRail}>
          {filteredProducts.map((product) => {
            const isBookmarked = bookmarkedIds.has(product.id);
            const inCart = (cartItems[product.id] || 0) > 0;

            return (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.productCardTop}>
                  <span className={`${styles.badgeTag} ${product.badgeClass}`}>
                    {product.badge}
                  </span>
                  <button
                    className={`${styles.bookmarkHeartBtn} ${isBookmarked ? styles.heartFilled : ""}`}
                    onClick={() => toggleBookmark(product.id)}
                    aria-label={`Save ${product.title}`}
                  >
                    <Heart size={16} fill={isBookmarked ? "#C4556F" : "none"} stroke={isBookmarked ? "#C4556F" : "currentColor"} />
                  </button>
                </div>

                <div className={styles.productImgWrapper}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.productImg}
                  />
                </div>

                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productDesc}>{product.description}</p>

                <div className={styles.productFooter}>
                  <div className={styles.priceCol}>
                    <div className={styles.priceRow}>
                      <span className={styles.currentPrice}>₹{product.price.toLocaleString("en-IN")}</span>
                      <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className={styles.ratingRow}>
                      <Star size={11} className={styles.starIcon} />
                      <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>

                  <button
                    className={`${styles.cartCircleBtn} ${inCart ? styles.cartCircleBtnAdded : ""}`}
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    {inCart ? <Check size={16} /> : <ShoppingCart size={15} />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Trust / Value Props Strip */}
      <section className={styles.trustCard}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <Leaf size={18} />
            </div>
            <div className={styles.trustTextCol}>
              <span className={styles.trustTitle}>Clean &amp; Safe</span>
              <span className={styles.trustSubtitle}>Curated with clean, quality ingredients</span>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <Stethoscope size={18} />
            </div>
            <div className={styles.trustTextCol}>
              <span className={styles.trustTitle}>Experts&apos; Choice</span>
              <span className={styles.trustSubtitle}>Recommended by nutrition experts</span>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <FlaskConical size={18} />
            </div>
            <div className={styles.trustTextCol}>
              <span className={styles.trustTitle}>No Nasties</span>
              <span className={styles.trustSubtitle}>No harmful additives or preservatives</span>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <Truck size={18} />
            </div>
            <div className={styles.trustTextCol}>
              <span className={styles.trustTitle}>Fast Delivery</span>
              <span className={styles.trustSubtitle}>Pan India delivery in 3–5 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle & Save Promo Banner */}
      <section className={styles.bundleCard}>
        <div className={styles.bundleLeft}>
          <div className={styles.bundleIconBadge}>
            <Gift size={22} />
          </div>
          <div className={styles.bundleTextCol}>
            <h3 className={styles.bundleTitle}>Bundle &amp; Save</h3>
            <p className={styles.bundleSubtitle}>Buy kits together and get up to 15% off.</p>
          </div>
        </div>
        <button
          className={styles.bundleBtn}
          onClick={() => showToast("Applied 15% bundle discount at checkout!")}
        >
          View Offers <ArrowRight size={13} />
        </button>
      </section>

      {/* Toast Notice */}
      {toastMessage && (
        <div className={styles.toastNotice} role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Leaf, ListCollapse, Plus, Search, SlidersHorizontal } from "lucide-react";
import api from "@/lib/api";
import styles from "../wellnessMeals.module.css";

type GroceryItem = { name: string; img: string };
type GroceryCategories = Record<string, GroceryItem[]>;
const FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=220";

const STARTER_CATEGORIES: GroceryCategories = {
  Vegetables: [
    { name: "Spinach", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=220" },
    { name: "Tomato", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=220" },
    { name: "Cucumber", img: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=220" },
    { name: "Carrot", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=220" },
    { name: "Broccoli", img: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=220" },
    { name: "Bell pepper", img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=220" },
  ],
  "Grains & Pulses": [
    { name: "Brown Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=220" },
    { name: "Moong Dal", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=220" },
    { name: "Quinoa", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=220" },
    { name: "Oats", img: "https://images.unsplash.com/photo-1517093728264-0d3f54a86c73?w=220" },
  ],
  Fruits: [
    { name: "Banana", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=220" },
    { name: "Apple", img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=220" },
    { name: "Blueberries", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=220" },
    { name: "Papaya", img: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=220" },
  ],
  "Spices & Others": [
    { name: "Turmeric", img: "https://images.unsplash.com/photo-1615485291234-9d694218abbe?w=220" },
    { name: "Cumin", img: "https://images.unsplash.com/photo-1599909533731-4aec3958da09?w=220" },
    { name: "Flax Seeds", img: FOOD_IMAGE },
    { name: "Himalayan Salt", img: FOOD_IMAGE },
  ],
};

const ITEM_IMAGE_BY_NAME = new Map(
  Object.values(STARTER_CATEGORIES)
    .flat()
    .map((item) => [item.name.toLowerCase(), item.img]),
);

const imageForItem = (name: string) => ITEM_IMAGE_BY_NAME.get(name.toLowerCase()) || FOOD_IMAGE;

export default function GroceryList() {
  const [categories, setCategories] = useState<GroceryCategories>(STARTER_CATEGORIES);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState("");

  const fetchGroceries = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const { data } = await api.get<Record<string, string[]>>("/meal-plan/grocery-list");
      if (data && Object.keys(data).length) {
        setCategories(Object.fromEntries(Object.entries(data).map(([category, items]) => [
          category,
          items.map((item) => {
            const name = item.split("(")[0].trim();
            return { name, img: imageForItem(name) };
          }),
        ])));
      } else {
        setNotice("Your plan has no grocery items yet, so a starter list is shown.");
      }
    } catch {
      setNotice("The live grocery list could not be reached, so a starter list is shown.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchGroceries(); }, [fetchGroceries]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.entries(categories).flatMap(([category, items]) => {
      const visibleItems = !query || category.toLowerCase().includes(query)
        ? items
        : items.filter((item) => item.name.toLowerCase().includes(query));
      return visibleItems.length ? [[category, visibleItems] as const] : [];
    });
  }, [categories, search]);

  const allCollapsed = Object.keys(categories).length > 0 && Object.keys(categories).every((category) => collapsed[category]);
  const toggleAll = () => setCollapsed(Object.fromEntries(Object.keys(categories).map((category) => [category, !allCollapsed])));

  const addItem = (event: FormEvent) => {
    event.preventDefault();
    const name = newItem.trim();
    if (!name) return;
    setCategories((current) => ({ ...current, "Added items": [...(current["Added items"] || []), { name, img: FOOD_IMAGE }] }));
    setCollapsed((current) => ({ ...current, "Added items": false }));
    setExpanded((current) => ({ ...current, "Added items": true }));
    setSearch("");
    setNewItem("");
    setShowAdd(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Grocery navigation">
          <Link className={styles.backLink} href="/app/meal-plan" aria-label="Back to meal plan"><ArrowLeft size={19} /></Link>
          <span className={styles.brand}><span className={styles.brandMark}>❧</span> Zenplate</span>
          <button className={styles.iconButton} type="button" onClick={toggleAll} aria-label={allCollapsed ? "Expand all categories" : "Collapse all categories"}><ListCollapse size={20} /></button>
        </nav>

        <header className={styles.groceryHead}>
          <div><p className={styles.eyebrow}>Plan, gather, nourish</p><h1 className={styles.leftTitle}>Grocery List</h1><p className={styles.weekLabel}>This week</p></div>
          <span className={styles.featureIcon}><Leaf size={20} /></span>
        </header>

        <label className={styles.searchBox}>
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search grocery items</span>
          <input className={styles.textInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for items…" />
          <SlidersHorizontal size={18} aria-hidden="true" />
        </label>

        {notice && <div className={styles.disclaimer} role="status"><span>ⓘ</span><span>{notice} <button className={styles.secondaryButton} type="button" onClick={fetchGroceries}>Retry live list</button></span></div>}

        {loading ? (
          <div className={styles.state} aria-live="polite"><div className={styles.skeleton} aria-label="Loading grocery list" /></div>
        ) : filteredCategories.length === 0 ? (
          <div className={styles.state}><div><span className={styles.stateIcon}><Search size={19} /></span><h2 className={styles.stateTitle}>No matching ingredients</h2><p className={styles.stateText}>Try a broader search, or add the item you need.</p><button className={styles.secondaryButton} type="button" onClick={() => setSearch("")}>Clear search</button></div></div>
        ) : (
          <div className={styles.categoryGrid}>
            {filteredCategories.map(([category, items]) => {
              const isCollapsed = Boolean(collapsed[category]);
              const isExpanded = Boolean(expanded[category]) || Boolean(search);
              const visibleItems = isExpanded ? items : items.slice(0, 4);
              const remaining = items.length - visibleItems.length;
              return (
                <section key={category} className={styles.groceryCategory}>
                  <button className={styles.categoryToggle} type="button" onClick={() => setCollapsed((current) => ({ ...current, [category]: !current[category] }))} aria-expanded={!isCollapsed}>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryCount}>{items.length} {items.length === 1 ? "item" : "items"} {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</span>
                  </button>
                  {!isCollapsed && (
                    <div className={styles.groceryItems}>
                      {visibleItems.map((item, index) => {
                        const key = `${category}:${item.name}:${index}`;
                        const isChecked = Boolean(checked[key]);
                        return (
                          <div className={styles.groceryItem} key={key}>
                            <button className={`${styles.checkButton} ${isChecked ? styles.checked : ""}`} type="button" onClick={() => setChecked((current) => ({ ...current, [key]: !current[key] }))} aria-pressed={isChecked} aria-label={`${isChecked ? "Uncheck" : "Check"} ${item.name}`}>
                              <img className={styles.itemImage} src={item.img} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = FOOD_IMAGE; }} />
                              <span className={styles.checkmark}><Check size={15} /></span>
                            </button>
                            <span className={styles.itemName}>{item.name}</span>
                          </div>
                        );
                      })}
                      {remaining > 0 && (
                        <button className={`${styles.categoryToggle} ${styles.moreAction}`} type="button" onClick={() => setExpanded((current) => ({ ...current, [category]: true }))} aria-label={`Show ${remaining} more ${category} items`}>
                          <span className={styles.moreBubble}>+{remaining}</span><span className={styles.itemName}>more</span>
                        </button>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <section className={`${styles.editorialCard} ${styles.groceryBanner}`}>
          <span className={styles.featureIcon}><Leaf size={20} /></span>
          <div><h2 className={styles.cardTitle}>Eat fresh, live well</h2><p className={styles.cardText}>Choose whole, natural foods for a nourished body and mind.</p></div>
          <div className={styles.bannerArt} aria-hidden="true" />
        </section>

        {showAdd ? (
          <form className={styles.addPanel} onSubmit={addItem}>
            <label className={styles.searchBox}><Plus size={18} /><span className="sr-only">New grocery item</span><input className={styles.textInput} autoFocus value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="Add an ingredient…" /></label>
            <button className={styles.primaryButton} type="submit" disabled={!newItem.trim()}>Add to list</button>
          </form>
        ) : (
          <button className={`${styles.primaryButton} ${styles.fullWidth}`} type="button" onClick={() => setShowAdd(true)}><Plus size={17} /> Add Item</button>
        )}
      </div>
    </main>
  );
}

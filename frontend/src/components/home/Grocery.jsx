// GroceryFinalPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaCertificate,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

/**
 * GroceryFinalPage
 *
 * - Grocery-only (products sample data)
 * - Advanced features: search, sort, price range, brand, rating, offers, product form, free delivery, stock filter
 * - Product card: image, name, brand, weight, rating (stars), reviews, assured badge, price/oldPrice/discount, delivery info, discount badge
 * - Add to cart / qty controls on card
 * - Cart persisted to localStorage
 * - Pagination (client-side)
 * - No wishlist, no cart total displayed anywhere (per request)
 */

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Saffola Instant Rolled Oats 1kg + 300g",
    brand: "Saffola",
    form: "Powder",
    weight: "1.3 kg",
    image:
     "https://m.media-amazon.com/images/I/71zYbHaoDuL._SX679_.jpg",
    rating: 4.4,
    reviews: 161087,
    assured: true,
    price: 206,
    oldPrice: 235,
    discountPct: 12,
    freeDelivery: true,
    inStock: true,
    offers: ["Special Price"],
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    name: "ALPINO High Protein Super Oats Chocolate 400g",
    brand: "Alpino",
    form: "Powder",
    weight: "400 g",
    image:
     "https://tse1.mm.bing.net/th/id/OIP.4aOQBNGWoQ_10nkv3Ui0yQHaGO?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.2,
    reviews: 38981,
    assured: true,
    price: 236,
    oldPrice: 249,
    discountPct: 5,
    freeDelivery: false,
    inStock: true,
    offers: ["Buy More, Save More"],
    createdAt: "2025-03-05",
  },
  {
    id: 3,
    name: "Manna Steel Cut Rolled Oats (1.4kg pack)",
    brand: "Manna",
    form: "Granules",
    weight: "1.4 kg",
    image:
      "https://cdn01.pharmeasy.in/dam/products_otc/J98659/manna-oats-jar-1kg-box-steel-cut-rolled-oats-rich-in-fibre-protein-2-1671742985.jpg?dim=700x0&dpr=1&q=100",
    rating: 4.3,
    reviews: 228052,
    assured: true,
    price: 199,
    oldPrice: 474,
    discountPct: 58,
    freeDelivery: true,
    inStock: false,
    offers: ["Special Price", "Limited Deal"],
    createdAt: "2025-02-18",
  },
  {
    id: 4,
    name: "Kellogg's Muesli Fruit Nut & Seeds 750g",
    brand: "Kellogg's",
    form: "Mixture",
    weight: "750 g",
    image:
     "https://m.media-amazon.com/images/I/615Cha0wdjS._SL1000_.jpg",
    rating: 4.5,
    reviews: 13308,
    assured: true,
    price: 404,
    oldPrice: 525,
    discountPct: 23,
    freeDelivery: false,
    inStock: true,
    offers: ["Special Price"],
    createdAt: "2025-04-01",
  },
  {
    id: 5,
    name: "Organic Carrots (500g)",
    brand: "FarmFresh",
    form: "Vegetable",
    weight: "500 g",
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=60",
    rating: 4.1,
    reviews: 5320,
    assured: false,
    price: 50,
    oldPrice: 60,
    discountPct: 17,
    freeDelivery: false,
    inStock: true,
    offers: [],
    createdAt: "2025-05-15",
  },
  {
    id: 6,
    name: "Organic Potatoes (500g)",        
    brand: "FarmFresh",
    form: "Vegetable",
    weight: "500 g",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60",
    rating: 4.0,
    reviews: 5320,
    assured: false,
    price: 50,
    oldPrice: 60,
    discountPct: 17,
    freeDelivery: false,
    inStock: true,
    offers: [],
    createdAt: "2025-05-15",},
    {
    id: 7,
    name: "Organic Potatoes (500g)",        
    brand: "FarmFresh",
    form: "Vegetable",
    weight: "500 g",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60",
    rating: 4.0,
    reviews: 5320,
    assured: false,
    price: 50,
    oldPrice: 60,
    discountPct: 17,
    freeDelivery: false,
    inStock: true,
    offers: [],
    createdAt: "2025-05-15",}
  // ...add more demo items as needed for testing pagination
];

// Utility: format currency
const fCurrency = (v) => `₹${v.toLocaleString()}`;

// Star rating visuals (rounded to half-star precision)
function StarRating({ rating, size = 12 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} className="text-yellow-500" style={{ width: size, height: size }} />
      ))}
      {half && <FaStar key="half" className="text-yellow-300" style={{ width: size, height: size, opacity: 0.6 }} />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaStar key={`e${i}`} className="text-gray-300" style={{ width: size, height: size }} />
      ))}
    </div>
  );
}

export default function GroceryFinalPage() {
  // Search & filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity"); // popularity, priceLow, priceHigh, newest
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000); // slider upper limit (adjust as needed)
  const [brandFilters, setBrandFilters] = useState([]);
  const [ratingFilters, setRatingFilters] = useState([]); // e.g., [4,3]
  const [offerFilters, setOfferFilters] = useState([]); // e.g., ["Special Price"]
  const [formFilters, setFormFilters] = useState([]); // e.g., ["Powder"]
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Cart (no total display)
  const [cart, setCart] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("grocery_cart_v2");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.warn("localStorage read error", e);
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("grocery_cart_v2", JSON.stringify(cart));
  }, [cart]);

  // Derived lists for filter controls
  const brands = useMemo(() => {
    const set = new Set(SAMPLE_PRODUCTS.map((p) => p.brand));
    return Array.from(set);
  }, []);

  const forms = useMemo(() => {
    const set = new Set(SAMPLE_PRODUCTS.map((p) => p.form));
    return Array.from(set);
  }, []);

  const offers = useMemo(() => {
    const s = new Set();
    SAMPLE_PRODUCTS.forEach((p) => p.offers.forEach((o) => s.add(o)));
    return Array.from(s);
  }, []);

  // Price range derived from data (set slider bounds)
  const [dataMin, dataMax] = useMemo(() => {
    const prices = SAMPLE_PRODUCTS.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  useEffect(() => {
    // ensure priceMax default covers data
    setPriceMin(dataMin);
    setPriceMax(dataMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMin, dataMax]);

  // Filtering pipeline
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = SAMPLE_PRODUCTS.filter((p) => {
      // Search text matches name, brand, or tag
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.offers && p.offers.join(" ").toLowerCase().includes(q));

      // Price range
      const matchesPrice = p.price >= priceMin && p.price <= priceMax;

      // Brand filter
      const matchesBrand = brandFilters.length === 0 || brandFilters.includes(p.brand);

      // Rating filter (any selected threshold)
      const matchesRating =
        ratingFilters.length === 0 || ratingFilters.some((rt) => p.rating >= rt);

      // Offers
      const matchesOffer = offerFilters.length === 0 || offerFilters.some((of) => p.offers.includes(of));

      // Form
      const matchesForm = formFilters.length === 0 || formFilters.includes(p.form);

      // Free delivery
      const matchesDelivery = !onlyFreeDelivery || p.freeDelivery;

      // Stock
      const matchesStock = !onlyInStock || p.inStock;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesBrand &&
        matchesRating &&
        matchesOffer &&
        matchesForm &&
        matchesDelivery &&
        matchesStock
      );
    });

    // Sorting
    if (sortBy === "priceLow") items = items.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") items = items.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest")
      items = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // else popularity - keep as-is (sample order)
    return items;
  }, [
    search,
    priceMin,
    priceMax,
    brandFilters,
    ratingFilters,
    offerFilters,
    formFilters,
    onlyFreeDelivery,
    onlyInStock,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Cart helpers
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === product.id);
      if (found) {
        return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, qty } : p));
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));

  // Filter handlers helpers
  const toggleArrayFilter = (value, setFn, arr) => {
    setFn((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Grocery Store — Groceries</h1>
          <p className="text-sm text-gray-600 mt-1">{filtered.length} item(s) found</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search groceries, brands, offers..."
              className="w-64 md:w-96 px-3 py-2 rounded border focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded border bg-white"
            aria-label="Sort products"
          >
            <option value="popularity">Sort: Popularity</option>
            <option value="priceLow">Sort: Price — Low to High</option>
            <option value="priceHigh">Sort: Price — High to Low</option>
            <option value="newest">Sort: Newest First</option>
          </select>

          <div className="hidden md:flex items-center gap-2 text-gray-700">
            <FaShoppingCart />
            <span className="font-medium">{cart.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* LEFT: Filters */}
        <aside className="md:col-span-1 bg-white p-4 rounded shadow sticky top-6 h-fit">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value || dataMin))}
                min={dataMin}
                max={priceMax}
                className="w-20 px-2 py-1 border rounded"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value || dataMax))}
                min={priceMin}
                max={Math.max(dataMax, priceMax)}
                className="w-24 px-2 py-1 border rounded"
              />
            </div>
            <div className="mt-2">
              <input
                type="range"
                min={dataMin}
                max={Math.max(dataMax, priceMax)}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Max price slider</div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Brand</h3>
            <div className="flex flex-col gap-2">
              {brands.map((b) => (
                <label key={b} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={brandFilters.includes(b)}
                    onChange={() => {
                      toggleArrayFilter(b, setBrandFilters, brandFilters);
                      setPage(1);
                    }}
                    className="w-4 h-4"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Customer Ratings</h3>
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ratingFilters.includes(r)}
                  onChange={() => {
                    toggleArrayFilter(r, setRatingFilters, ratingFilters);
                    setPage(1);
                  }}
                  className="w-4 h-4"
                />
                <span>{r}★ & above</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Offers</h3>
            {offers.length === 0 ? (
              <div className="text-sm text-gray-500">No offers in data</div>
            ) : (
              offers.map((o) => (
                <label key={o} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offerFilters.includes(o)}
                    onChange={() => {
                      toggleArrayFilter(o, setOfferFilters, offerFilters);
                      setPage(1);
                    }}
                    className="w-4 h-4"
                  />
                  {o}
                </label>
              ))
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Product Form</h3>
            {forms.map((f) => (
              <label key={f} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formFilters.includes(f)}
                  onChange={() => {
                    toggleArrayFilter(f, setFormFilters, formFilters);
                    setPage(1);
                  }}
                  className="w-4 h-4"
                />
                {f}
              </label>
            ))}
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyFreeDelivery}
                onChange={() => {
                  setOnlyFreeDelivery((s) => !s);
                  setPage(1);
                }}
                className="w-4 h-4"
              />
              Free Delivery
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={() => {
                  setOnlyInStock((s) => !s);
                  setPage(1);
                }}
                className="w-4 h-4"
              />
              In Stock Only
            </label>
          </div>

          <div className="mt-2">
            <button
              onClick={() => {
                // reset filters
                setSearch("");
                setSortBy("popularity");
                setPriceMin(dataMin);
                setPriceMax(dataMax);
                setBrandFilters([]);
                setRatingFilters([]);
                setOfferFilters([]);
                setFormFilters([]);
                setOnlyFreeDelivery(false);
                setOnlyInStock(false);
                setPage(1);
              }}
              className="text-sm text-blue-600"
            >
              Reset all filters
            </button>
          </div>
        </aside>

        {/* MAIN: Product grid */}
        <main className="md:col-span-4 bg-white p-5 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((p) => {
              const cartItem = cart.find((c) => c.id === p.id);
              return (
                <article
                  key={p.id}
                  className="bg-white p-4 rounded shadow hover:shadow-lg transition relative flex flex-col"
                >
                  {/* discount badge */}
                  {p.discountPct > 0 && (
                    <div className="absolute left-3 top-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {p.discountPct}% OFF
                    </div>
                  )}

                  {/* assured / delivery badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    {p.assured && (
                      <span
                        className="flex items-center gap-1 bg-white px-2 py-0.5 rounded text-xs font-semibold shadow"
                        title="Assured"
                      >
                        <FaCertificate className="text-blue-600" /> Assured
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4">
                    <img src={p.image} alt={p.name} className="max-h-40 object-contain" />
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{p.name}</h3>
                    <div className="text-xs text-gray-500">{p.brand} • {p.weight}</div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          {p.rating}
                          <FaStar className="text-white" style={{ width: 10, height: 10 }} />
                        </div>
                        <div className="text-xs text-gray-500">({p.reviews.toLocaleString()})</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {p.freeDelivery && (
                        <span className="flex items-center gap-1">
                          <FaTruck /> Free Delivery
                        </span>
                      )}
                      {!p.inStock && <span className="text-red-600 font-semibold">Out of Stock</span>}
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-bold">{fCurrency(p.price)}</div>
                      <div className="text-xs text-gray-500 line-through">{fCurrency(p.oldPrice)}</div>
                    </div>

                    {/* Add to cart or qty controls */}
                    <div>
                      {cartItem ? (
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQty(p.id, cartItem.qty - 1)}
                            className="px-2 py-1"
                            aria-label="decrease"
                          >
                            <FaMinus />
                          </button>
                          <div className="px-3">{cartItem.qty}</div>
                          <button
                            onClick={() => updateQty(p.id, cartItem.qty + 1)}
                            className="px-2 py-1"
                            aria-label="increase"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(p)}
                          disabled={!p.inStock}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            p.inStock ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tags & star strip */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      {p.offers.map((o) => (
                        <span key={o} className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                          {o}
                        </span>
                      ))}
                    </div>
                    <div>
                      <StarRating rating={p.rating} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((s) => Math.max(1, s - 1))}
              className="px-3 py-1 border rounded"
              disabled={page === 1}
            >
              Prev
            </button>

            <div className="text-sm">
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
              className="px-3 py-1 border rounded"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </main>

        {/* RIGHT: Cart panel (no total shown) */}
        {/* <aside className="md:col-span-1 bg-white p-4 rounded shadow h-fit">
          <h3 className="font-semibold mb-3">Cart ({cart.reduce((s, c) => s + c.qty, 0)} items)</h3>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((c) => (
                <div key={c.id} className="flex gap-3 items-start">
                  <img src={c.image} alt={c.name} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.brand} • {c.weight}</div>
                    <div className="mt-2 text-sm">Qty: {c.qty}</div>
                    <div className="mt-1 text-sm font-semibold">{fCurrency(c.price * c.qty)}</div>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <button
                      onClick={() => updateQty(c.id, c.qty + 1)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateQty(c.id, c.qty - 1)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCart(c.id)}
                      className="text-red-600 text-xs mt-1"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t">
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </aside> */}
      </div>
    </div>
  );
}

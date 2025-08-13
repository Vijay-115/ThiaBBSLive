// ProductListingFull.jsx  (Fruits.jsx)
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const sampleFruits = [];

// API endpoints
const API_LIST = `${import.meta.env.VITE_API_URL}/api/fruits/public`;
const API_FACETS = `${import.meta.env.VITE_API_URL}/api/fruits/facets`;

const inr = (n) => new Intl.NumberFormat("en-IN").format(n);

export default function FruitsDetails({ products = sampleFruits }) {
  // NEW: live items from API
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Use live items if present, else fallback to prop/static
  const data = useMemo(
    () => (apiItems && apiItems.length ? apiItems : products),
    [apiItems, products]
  );

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);

  // Price range from server (to clamp slider/inputs)
  const [rangeMin, setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(30000);

  const allBrands = useMemo(
    () => Array.from(new Set(data.map((p) => p.brand).filter(Boolean))),
    [data]
  );
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [minRating, setMinRating] = useState(0);
  const [selectedRatings, setSelectedRatings] = useState(new Set());
  const [gstInvoiceOnly, setGstInvoiceOnly] = useState(false);
  const [delivery1DayOnly, setDelivery1DayOnly] = useState(false);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [compareIds, setCompareIds] = useState(new Set());

  function toggleSetItem(setState, value) {
    setState((prev) => {
      const copy = new Set(prev);
      copy.has(value) ? copy.delete(value) : copy.add(value);
      return copy;
    });
  }

  function resetFilters() {
    setSearch("");
    setMinPrice(rangeMin);
    setMaxPrice(rangeMax);
    setSelectedBrands(new Set());
    setMinRating(0);
    setSelectedRatings(new Set());
    setGstInvoiceOnly(false);
    setDelivery1DayOnly(false);
  }

  // NEW: fetch facets (price range) once
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { data } = await axios.get(API_FACETS);
        const min = Math.max(0, Math.floor(data?.price?.min ?? 0));
        const max = Math.ceil(data?.price?.max ?? 30000);
        if (!live) return;
        setRangeMin(min);
        setRangeMax(max);
        setMinPrice(min);
        setMaxPrice(max);
      } catch {
        // ignore; fall back to defaults
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  // NEW: fetch fruits whenever filters/sort change
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr("");

    const params = {
      search: search || undefined,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      rating_gte: selectedRatings.size
        ? Math.max(...Array.from(selectedRatings))
        : minRating || undefined,
      delivery1Day: delivery1DayOnly || undefined,
      sort:
        sortBy === "price-asc"
          ? "price-asc"
          : sortBy === "price-desc"
          ? "price-desc"
          : sortBy === "newest"
          ? "newest"
          : "popularity",
      page: 1,
      limit: 100, // plenty for this page
    };

    (async () => {
      try {
        const { data } = await axios.get(API_LIST, {
          params,
          signal: controller.signal,
        });
        setApiItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (e.name !== "CanceledError") {
          setErr(
            e?.response?.data?.error || e?.message || "Failed to load fruits"
          );
          setApiItems([]); // fall back to local sample via data memo
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [
    search,
    minPrice,
    maxPrice,
    selectedRatings,
    minRating,
    delivery1DayOnly,
    sortBy,
  ]);

  const filtered = useMemo(() => {
    // your original local filtering, now runs against `data`
    return data
      .filter((p) => {
        if (
          search.trim() &&
          !`${p.name || ""} ${p.variety || ""}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return false;
        if (selectedBrands.size > 0 && !selectedBrands.has(p.brand))
          return false;
        if (p.pricePerKg < minPrice || p.pricePerKg > maxPrice) return false;
        if (selectedRatings.size > 0) {
          const matches = Array.from(selectedRatings).some(
            (threshold) => p.rating >= threshold
          );
          if (!matches) return false;
        } else if (p.rating < minRating) return false;
        if (gstInvoiceOnly && !p.gstInvoice) return false;
        if (delivery1DayOnly && !p.deliveryIn1Day) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popularity") return b.rating - a.rating;
        if (sortBy === "price-asc") return a.pricePerKg - b.pricePerKg;
        if (sortBy === "price-desc") return b.pricePerKg - a.pricePerKg;
        if (sortBy === "newest")
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        return 0;
      });
  }, [
    data,
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    gstInvoiceOnly,
    delivery1DayOnly,
    sortBy,
    selectedRatings,
  ]);

  const toggleCompare = (id) =>
    setCompareIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar */}
      <aside className="w-72 border rounded bg-white p-4 sticky top-4 self-start h-fit">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>

        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fruits..."
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              min={rangeMin}
              max={maxPrice}
              onChange={(e) => setMinPrice(Number(e.target.value || rangeMin))}
              className="w-1/2 border rounded px-2 py-1 text-sm"
            />
            <input
              type="number"
              value={maxPrice}
              min={minPrice}
              max={rangeMax}
              onChange={(e) => setMaxPrice(Number(e.target.value || rangeMax))}
              className="w-1/2 border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-3">
            Customer Ratings
          </label>
          <div className="flex flex-col gap-2 text-sm">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRatings.has(rating)}
                  onChange={() => toggleSetItem(setSelectedRatings, rating)}
                  className="cursor-pointer w-3 h-4 mx-3"
                />
                <span>{"★".repeat(rating)} &amp; above</span>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="mb-4 text-sm space-y-2 mx-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={delivery1DayOnly}
              onChange={() => setDelivery1DayOnly((s) => !s)}
              className="w-3 h-4"
            />
            Delivery in 1 day
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetFilters}
            className="flex-1 border rounded py-1 text-sm"
          >
            Clear
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Fruits & Vegetables</h1>
          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `Showing ${filtered.length} products`}
            {err && <span className="text-red-600 ml-2">({err})</span>}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="flex border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <div className="w-36 h-36 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 ml-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medium text-gray-800">{p.name}</h2>
                    <div className="text-xs text-gray-500 mt-1">
                      {p.reviewsText}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ₹{inr(p.pricePerKg)}
                    </div>
                    <div className="text-xs line-through text-gray-400">
                      ₹{inr(p.oldPricePerKg)}
                    </div>
                    <div className="text-green-600 text-sm">
                      {p.discountText}
                    </div>
                  </div>
                </div>

                <ul className="list-disc list-inside text-sm text-gray-700 mt-3">
                  {(p.specs || []).slice(0, 4).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 mt-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={compareIds.has(p.id)}
                      onChange={() => toggleCompare(p.id)}
                    />
                    <span>Add to Compare</span>
                  </label>
                  {p.bestseller && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-xs rounded">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

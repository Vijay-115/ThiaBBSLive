// ProductListingFull.jsx
import React, { useMemo, useState } from "react";

const sampleFruits = [
  {
    id: 101,
    name: "Mango",
    variety: "Alphonso",
    weight: "300-350 g",
    color: "Golden Yellow",
    taste: "Sweet and aromatic",
    origin: "Ratnagiri, India",
    rating: 4.8,
    reviewsText: "12,300 Ratings & 850 Reviews",
    pricePerKg: 350,
    oldPricePerKg: 400,
    discountText: "13% off",
    seasonalOffer: "Available only in summer",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
    organic: true,
    deliveryIn1Day: true,
    freshnessDays: 7,
    addedAt: "2024-03-01",
    bestseller: true,
    specs: ["300-350 g", "Golden Yellow", "Sweet & Aromatic", "From Ratnagiri"], // added
  },
  {
    id: 102,
    name: "Apple",
    variety: "Fuji",
    weight: "200-250 g",
    color: "Red with yellow stripes",
    taste: "Sweet and crisp",
    origin: "Shimla, India",
    rating: 4.5,
    reviewsText: "8,500 Ratings & 600 Reviews",
    pricePerKg: 250,
    oldPricePerKg: 280,
    discountText: "11% off",
    seasonalOffer: "Available in autumn",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    organic: false,
    deliveryIn1Day: false,
    freshnessDays: 10,
    addedAt: "2024-04-15",
    bestseller: false,
    specs: ["200-250 g", "Red with yellow stripes", "Sweet & Crisp", "From Shimla"],
  },
  {
    id: 103,
    name: "Banana",
    variety: "Cavendish",
    weight: "120-150 g",
    color: "Yellow",
    taste: "Sweet and soft",
    origin: "Kerala, India",
    rating: 4.2,
    reviewsText: "15,000 Ratings & 1,200 Reviews",
    pricePerKg: 60,
    oldPricePerKg: 70,
    discountText: "14% off",
    seasonalOffer: "Available year-round",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    organic: true,
    deliveryIn1Day: true,
    freshnessDays: 5,
    addedAt: "2024-05-10",
    bestseller: true,
    specs: ["120-150 g", "Yellow", "Sweet & Soft", "From Kerala"],
  },
  {
    id: 104,
    name: "Strawberry",
    variety: "Albion",
    weight: "15-20 g per berry",
    color: "Bright Red",
    taste: "Sweet and slightly tart",
    origin: "Mahabaleshwar, India",
    rating: 4.7,
    reviewsText: "7,200 Ratings & 540 Reviews",
    pricePerKg: 600,
    oldPricePerKg: 650,
    discountText: "8% off",
    seasonalOffer: "Available in spring",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg",
    organic: false,
    deliveryIn1Day: false,
    freshnessDays: 4,
    addedAt: "2024-02-28",
    bestseller: false,
    specs: ["15-20 g per berry", "Bright Red", "Sweet & Tart", "From Mahabaleshwar"],
  },
  {
    id: 105,
    name: "Pineapple",
    variety: "Queen",
    weight: "1.2-1.5 kg",
    color: "Golden brown",
    taste: "Sweet and tangy",
    origin: "Assam, India",
    rating: 4.3,
    reviewsText: "4,900 Ratings & 380 Reviews",
    pricePerKg: 120,
    oldPricePerKg: 140,
    discountText: "14% off",
    seasonalOffer: "Available in summer",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg",
    organic: true,
    deliveryIn1Day: true,
    freshnessDays: 6,
    addedAt: "2024-03-20",
    bestseller: false,
    specs: ["1.2-1.5 kg", "Golden Brown", "Sweet & Tangy", "From Assam"],
  },
];

const inr = (n) => new Intl.NumberFormat("en-IN").format(n);

export default function FruitsDetails({ products = sampleFruits }) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
    [products]
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
    setMinPrice(0);
    setMaxPrice(30000);
    setSelectedBrands(new Set());
    setMinRating(0);
    setSelectedRatings(new Set());
    setGstInvoiceOnly(false);
    setDelivery1DayOnly(false);
  }

  const filtered = useMemo(() => {
    return products
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
          return (
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
        return 0;
      });
  }, [
    products,
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
              onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              className="w-1/2 border rounded px-2 py-1 text-sm"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value || 0))}
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
                <span>
                  {"★".repeat(rating)} &amp; above
                </span>
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
          <h1 className="text-2xl font-semibold">Fruits</h1>
          <div className="text-sm text-gray-600">
            Showing {filtered.length} products
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

// ProductListingFull.jsx
import React, { useMemo, useState } from "react";

const sampleProducts = [
  {
    id: 101,
    brand: "vivo",
    title: "vivo T4 5G (Phantom Grey, 256 GB)",
    rating: 4.5,
    reviewsText: "41,101 Ratings & 1,993 Reviews",
    specs: [
      "8 GB RAM | 256 GB ROM",
      "17.2 cm (6.77 inch) Display",
      "50MP (OIS) + 2MP | 32MP Front Camera",
      "7300 mAh Battery",
      "Snapdragon 7s Gen 3 5G Processor",
    ],
    price: 23999,
    oldPrice: 27999,
    discountText: "14% off",
    exchangeOffer: "Upto ₹21,500 Off on Exchange",
    image: "https://tse3.mm.bing.net/th/id/OIP.fgk1nqCD-Ufjxm9SPdkjiwHaEg?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
    assured: true,
    gstInvoice: true,
    deliveryIn1Day: true,
    ram: 8,
    createdAt: "2024-12-01",
    bestseller: false,
  },
  {
    id: 102,
    brand: "vivo",
    title: "vivo T4 5G (Phantom Grey, 128 GB)",
    rating: 5,
    reviewsText: "41,101 Ratings & 1,993 Reviews",
    specs: [
      "8 GB RAM | 128 GB ROM",
      "17.2 cm (6.77 inch) Display",
      "50MP (OIS) + 2MP | 32MP Front Camera",
      "7300 mAh Battery",
      "Snapdragon 7s Gen 3 5G Processor",
    ],
    price: 21999,
    oldPrice: 25999,
    discountText: "15% off",
    exchangeOffer: "Upto ₹19,350 Off on Exchange",
    image: "https://th.bing.com/th/id/R.de59b2f20d94dba01492b6a6482c5487?rik=dDopPeiZJueYYA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-mobile-phone-smartphone-cell-phone-mobile-phone-iphone-icon-1024.png&ehk=56gvwYNk%2b1up7wY8AwSozfEdvUc0Dtxp9z5F%2fmwbKrE%3d&risl=&pid=ImgRaw&r=0",
    assured: true,
    gstInvoice: false,
    deliveryIn1Day: false,
    ram: 8,
    createdAt: "2024-11-20",
    bestseller: true,
  },
  {
    id: 103,
    brand: "vivo",
    title: "vivo T4 5G (Emerald Blaze, 256 GB)",
    rating: 4.5,
    reviewsText: "41,101 Ratings & 1,993 Reviews",
    specs: [
      "8 GB RAM | 256 GB ROM",
      "17.2 cm (6.77 inch) Display",
      "50MP (OIS) + 2MP | 32MP Front Camera",
      "7300 mAh Battery",
      "Snapdragon 7s Gen 3 5G Processor",
    ],
    price: 23999,
    oldPrice: 27999,
    discountText: "14% off",
    exchangeOffer: "Upto ₹21,500 Off on Exchange",
    image: "data:image/webp;base64,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",
    assured: true,
    gstInvoice: true,
    deliveryIn1Day: false,
    ram: 8,
    createdAt: "2024-10-05",
    bestseller: false,
  },
  {
    id: 104,
    brand: "otherBrand",
    title: "Example Phone X (Blue, 128 GB)",
    rating: 4.0,
    reviewsText: "2,100 Ratings & 120 Reviews",
    specs: ["6 GB RAM | 128 GB ROM", "6.5 inch Display", "5000 mAh Battery"],
    price: 14999,
    oldPrice: 16999,
    discountText: "11% off",
    exchangeOffer: "Upto ₹5,000 Off on Exchange",
    image: "https://pngimg.com/uploads/smartphone/smartphone_PNG8530.png",
    assured: false,
    gstInvoice: true,
    deliveryIn1Day: false,
    ram: 6,
    createdAt: "2024-09-12",
    bestseller: false,
  },
  {
    id: 105,
    brand: "vivo",
    title: "vivo T4 Lite (Mint, 64 GB)",
    rating: 3.9,
    reviewsText: "5,101 Ratings & 402 Reviews",
    specs: ["4 GB RAM | 64 GB ROM", "6.4 inch Display", "4500 mAh Battery"],
    price: 9999,
    oldPrice: 11999,
    discountText: "16% off",
    exchangeOffer: "Upto ₹3,500 Off on Exchange",
    image: "https://tse2.mm.bing.net/th/id/OIP.VTsDnaylVd3iYMwemwTlFgHaI3?cb=thfc1&w=500&h=599&rs=1&pid=ImgDetMain&o=7&rm=3",
    assured: false,
    gstInvoice: false,
    deliveryIn1Day: true,
    ram: 4,
    createdAt: "2024-08-01",
    bestseller: false,
  },
];



const inr = (n) => new Intl.NumberFormat("en-IN").format(n);

export default function ProductListingFull({ products = sampleProducts }) {
  // Filters & UI state
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  );
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [minRating, setMinRating] = useState(0); // legacy fallback if you want
  const [selectedRAM, setSelectedRAM] = useState(new Set());
  const [gstInvoiceOnly, setGstInvoiceOnly] = useState(false);
  const [delivery1DayOnly, setDelivery1DayOnly] = useState(false);

  // View & sorting
  const [view, setView] = useState("grid"); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState("popularity"); // popularity, price-asc, price-desc, newest

  // Compare
  const [compareIds, setCompareIds] = useState(new Set());

  // Ratings (checkboxes like "4★ & above")
  const [selectedRatings, setSelectedRatings] = React.useState(new Set());

  // Helper toggles
  function toggleSetItem(setState, value) {
    setState((prev) => {
      const copy = new Set(prev);
      if (copy.has(value)) copy.delete(value);
      else copy.add(value);
      return copy;
    });
  }

  function resetFilters() {
    setSearch("");
    setMinPrice(0);
    setMaxPrice(30000);
    setSelectedBrands(new Set());
    setMinRating(0);
    setSelectedRAM(new Set());
    setGstInvoiceOnly(false);
    setDelivery1DayOnly(false);
    setSelectedRatings(new Set()); // clear rating checkboxes too
  }

  // Filtering
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        // search (title)
        if (
          search.trim() &&
          !p.title.toLowerCase().includes(search.trim().toLowerCase())
        )
          return false;

        // brand
        if (selectedBrands.size > 0 && !selectedBrands.has(p.brand))
          return false;

        // price range
        if (p.price < minPrice || p.price > maxPrice) return false;

        // rating: selectedRatings checkboxes (each means "N stars & above")
        if (selectedRatings.size > 0) {
          const matches = Array.from(selectedRatings).some(
            (threshold) => p.rating >= threshold
          );
          if (!matches) return false;
        } else {
          // fallback to minRating if no checkbox is selected
          if (p.rating < minRating) return false;
        }

        // RAM: selectedRAM values mean "R GB & above"
        if (selectedRAM.size > 0) {
          const matchesRam = Array.from(selectedRAM).some((r) => p.ram >= r);
          if (!matchesRam) return false;
        }

        // GST invoice
        if (gstInvoiceOnly && !p.gstInvoice) return false;

        // delivery 1 day
        if (delivery1DayOnly && !p.deliveryIn1Day) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popularity") return b.rating - a.rating;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "newest")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    selectedRAM,
    gstInvoiceOnly,
    delivery1DayOnly,
    sortBy,
    selectedRatings, // <-- important: rating selections must be a dep
  ]);

  // Distinct RAM options (sorted)
  const ramOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.ram)))
        .sort((a, b) => a - b)
        .map((r) => r),
    [products]
  );

  const toggleCompare = (id) =>
    setCompareIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar */}
      <aside className="w-72 border rounded bg-white p-4 sticky top-4 self-start h-fit">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product title..."
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              className="w-1/2 border rounded px-2 py-1 text-sm"
              aria-label="Minimum price"
            />
            <input
              type="number"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(Number(e.target.value || 0))}
              className="w-1/2 border rounded px-2 py-1 text-sm"
              aria-label="Maximum price"
            />
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 ">Brands</label>
          <div className="space-y-2">
            {allBrands.map((b) => (
              <label key={b} className="flex items-center gap-2 mx-3">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(b)}
                  onChange={() => toggleSetItem(setSelectedBrands, b)}
                  className="w-3 h-4"
                />
                <span className="mx-2">{b}</span>
              </label>
            ))}
          </div>
        </div>

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
                  {Array.from({ length: rating })
                    .map(() => "★")
                    .join("")}{" "}
                  &nbsp; &amp; above
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">RAM</label>
          <div className="space-y-2 text-sm">
            {ramOptions.map((r) => (
              <label key={r} className="flex items-center gap-2 mx-3">
                <input
                  type="checkbox"
                  checked={selectedRAM.has(r)}
                  onChange={() => toggleSetItem(setSelectedRAM, r)}
                  className="w-3 h-4"
                />
                <span>{r} GB & above</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4 text-sm space-y-2 mx-3 ">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gstInvoiceOnly}
              onChange={() => setGstInvoiceOnly((s) => !s)}
              className="w-3 h-4"
            />
            GST Invoice Available
          </label>
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
            onClick={() => {}}
            className="flex-1 bg-blue-600 text-white py-1 rounded text-sm"
          >
            Apply
          </button>
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
        {/* Breadcrumb & top controls */}
        <div className="mb-4">
          <nav className="text-sm text-gray-600 mb-2">
            Home &gt; Mobiles &gt; Mobiles
          </nav>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Vivo T4 5G</h1>
              <div className="text-sm text-gray-600">
                Showing {filtered.length} products
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price — Low to High</option>
                <option value="price-desc">Price — High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex items-center gap-2 border rounded px-2">
                <button
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={`px-2 py-1 text-sm ${view === "grid" ? "font-semibold" : ""
                    }`}
                >
                  Grid
                </button>
                <button
                  aria-label="Table / row view"
                  onClick={() => setView("table")}
                  className={`px-2 py-1 text-sm ${view === "table" ? "font-semibold" : ""
                    }`}
                >
                  Rows
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table header when in 'table' view */}
        {view === "table" && (
          <div className="hidden md:flex items-center bg-gray-50 border rounded px-4 py-2 text-sm text-gray-700 mb-2">
            <div className="w-20">Image</div>
            <div className="flex-1">Product</div>
            <div className="w-64">Key Specs</div>
            <div className="w-40 text-right">Price & Offers</div>
            <div className="w-28 text-center">Compare</div>
          </div>
        )}

        {/* Products list */}
        <div className="space-y-4">
          {filtered.map((p) =>
            view === "grid" ? (
              <article
                key={p.id}
                className="flex border rounded-lg p-4 hover:shadow-md transition bg-white"
              >
                <div className="w-36 h-36 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  {/* Replace with real image path */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-medium text-gray-800">{p.title}</h2>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.reviewsText}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold">₹{inr(p.price)}</div>
                      <div className="text-xs line-through text-gray-400">
                        ₹{inr(p.oldPrice)}
                      </div>
                      <div className="text-green-600 text-sm">
                        {p.discountText}
                      </div>
                    </div>
                  </div>

                  <ul className="list-disc list-inside text-sm text-gray-700 mt-3">
                    {p.specs.slice(0, 4).map((s, i) => (
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

                    {p.assured && (
                      <span className="px-2 py-0.5 border text-xs rounded text-blue-700">
                        Assured
                      </span>
                    )}
                    {p.bestseller && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-xs rounded">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ) : (
              // Row / table-like layout
              <div
                key={p.id}
                className="md:flex items-center border rounded px-4 py-3 bg-white"
              >
                <div className="w-20 flex items-center">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full object-contain"
                  />
                </div>

                <div className="flex-1 px-4">
                  <div className="font-medium text-gray-800">{p.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.reviewsText}
                  </div>
                </div>

                <div className="w-64 text-sm text-gray-700">
                  <ul className="list-disc list-inside">
                    {p.specs.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="w-40 text-right">
                  <div className="text-lg font-bold">₹{inr(p.price)}</div>
                  <div className="text-xs line-through text-gray-400">
                    ₹{inr(p.oldPrice)}
                  </div>
                  <div className="text-green-600 text-sm">{p.discountText}</div>
                  <div className="text-xs mt-1">{p.exchangeOffer}</div>
                </div>

                <div className="w-28 text-center">
                  <input
                    type="checkbox"
                    checked={compareIds.has(p.id)}
                    onChange={() => toggleCompare(p.id)}
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* Compare bar */}
        {compareIds.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-white border rounded p-3 shadow-md flex items-center gap-4">
            <div className="text-sm">{compareIds.size} product(s) selected</div>
            <button className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
              Compare
            </button>
            <button
              className="text-sm underline"
              onClick={() => setCompareIds(new Set())}
            >
              Clear
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

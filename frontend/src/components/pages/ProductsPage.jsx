import { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";
import DeliverTo from "../DeliverTo";
import { useVendorAssignment } from "../../../context/VendorAssignmentContext";

export default function ProductsPage() {
  const { assigned } = useVendorAssignment();
  const [rows, setRows] = useState([]);
  const [loading, setL] = useState(false);

  async function load() {
    setL(true);
    try {
      const { data } = await instance.get("/api/products", {
        params: { _t: Date.now() },
      });
      setRows(Array.isArray(data) ? data : data?.products || []);
    } finally {
      setL(false);
    }
  }

  useEffect(() => {
    load();
  }, [assigned?.vendorId]);

  return (
    <div style={{ padding: 16 }}>
      <DeliverTo />
      <h2 style={{ marginTop: 16 }}>Products</h2>
      {loading ? (
        <div>Loading…</div>
      ) : rows.length === 0 ? (
        <div>No products</div>
      ) : (
        <ul>
          {rows.map((p) => (
            <li key={p._id}>
              {p.name || p.title} — ₹{p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

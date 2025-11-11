import React, { useState } from "react";
import { useCart } from "../store/cart";
import { supabase } from "../lib/supabase";

export default function CheckoutForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    notes: "",
    payment: "GCASH",
    proofFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    // === Validate name ===
    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (form.name.trim().length < 2) {
      alert("Name must be at least 2 characters long.");
      return;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(form.name)) {
      alert(
        "Name can only contain letters, spaces, and basic punctuation (. ' -)."
      );
      return;
    }

    // === Validate contact number ===
    if (!form.contact.trim()) {
      alert("Please enter your contact number.");
      return;
    }
    // Remove spaces and dashes for validation
    const cleanContact = form.contact.replace(/[\s-]/g, "");
    if (!/^\d{10,11}$/.test(cleanContact)) {
      alert("Contact number must be 10-11 digits (e.g., 09123456789).");
      return;
    }

    // === Validate address ===
    if (!form.address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    setLoading(true);

    // === Upload payment proof ===
    let proofUrl = null;
    if (form.proofFile) {
      const sanitizedName = form.proofFile.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      const fileName = `${Date.now()}-${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from("proofs")
        .upload(fileName, form.proofFile);

      if (error) {
        console.error("Upload error:", error);
      } else if (data) {
        const { data: publicData } = supabase.storage
          .from("proofs")
          .getPublicUrl(data.path);
        proofUrl = publicData.publicUrl;
      }
    }

    // === Build item summary for email ===
    const itemSummary = items
      .map((i) => {
        const addons =
          i.addons && i.addons.length
            ? `\n  └ Add-ons: ${i.addons
                .map((a: any) => `${a.addon.name} × ${a.quantity}`)
                .join(", ")}`
            : "";
        return `• ${i.product.name} × ${i.quantity}${addons}`;
      })
      .join("\n");

    // === Send Email Notification via Resend (do not await) ===
    fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.name,
        contact_number: form.contact,
        delivery_address: form.address,
        payment_method: form.payment,
        total: total(),
        item_summary: itemSummary,
        proof_url: proofUrl,
      }),
    })
      .then(() => {
        console.log("Email notification sent via Resend!");
      })
      .catch((err) => {
        console.error("Failed to send email via Resend:", err);
      });

    // === Continue with DB operations (await as before) ===
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: form.name,
          contact_number: form.contact,
          delivery_address: form.address,
          notes: form.notes,
          payment_method: form.payment,
          proof_url: proofUrl,
          total_cents: total(),
          status: "PENDING",
        },
      ])
      .select()
      .single();

    if (orderErr || !order) {
      console.error("Order error:", orderErr);
      alert("Error saving order. Please try again.");
      setLoading(false);
      return;
    }

    // === Insert order items ===
    const detailedItems: any[] = [];
    for (const item of items) {
      const { data: orderItem, error: itemErr } = await supabase
        .from("order_items")
        .insert([
          {
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
          },
        ])
        .select()
        .single();

      if (itemErr) {
        console.error("Order item error:", itemErr);
        continue;
      }

      if (orderItem && item.addons.length) {
        const addonData = item.addons.map((a) => ({
          order_item_id: orderItem.id,
          addon_id: a.addon.id,
          quantity: a.quantity,
        }));
        await supabase.from("order_item_addons").insert(addonData);
      }

      detailedItems.push({
        product_name: item.product.name,
        quantity: item.quantity,
        addons: item.addons.map((a) => ({
          name: a.addon.name,
          quantity: a.quantity,
        })),
      });
    }

    // === Success behavior ===
    clear();
    setLoading(false);

    // Close checkout modal and trigger success
    if (onClose) onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 space-y-4 bg-white rounded-2xl shadow-sm border border-orange-100"
    >
      <h2 className="text-xl font-semibold text-center text-orange-500">
        Checkout
      </h2>

      {/* === Customer Info === */}
      <input
        required
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-2 w-full outline-none transition-all"
      />
      <input
        required
        placeholder="Contact Number"
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
        className="border border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-2 w-full outline-none transition-all"
      />
      <textarea
        required
        placeholder="Delivery Address (Lalamove serviceable areas only)"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="border border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-2 w-full outline-none transition-all"
      />
      <textarea
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="border border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-2 w-full outline-none transition-all"
      />

      {/* === Payment Method === */}
      <label className="block font-medium mt-3 text-gray-700">
        Payment Method
      </label>
      <select
        value={form.payment}
        onChange={(e) => setForm({ ...form, payment: e.target.value })}
        className="border border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-2 w-full outline-none transition-all"
      >
  <option value="BDO">BDO</option>
  <option value="MAYA">Maya</option>
  <option value="GCASH">GCash</option>
      </select>

      {/* === Payment Details === */}
      <div className="mt-2 bg-orange-50 border border-orange-100 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Send payment via{" "}
          <span className="text-orange-500 font-semibold">{form.payment}</span>
        </p>
        <div className="bg-white rounded p-3 text-sm space-y-1">
          {form.payment === "BDO" && (
            <>
              <p className="font-semibold text-gray-800">BDO Account</p>
              <p className="text-gray-600">Account Name: Nina May Calusin</p>
              <p className="text-gray-600">Account Number: 007190098353</p>
            </>
          )}
          {/* BPI option removed */}
          {form.payment === "MAYA" && (
            <>
              <p className="font-semibold text-gray-800">Maya</p>
              <p className="text-gray-600">Account Name: Nina May Calusin</p>
              <p className="text-gray-600">Mobile Number: 09952849906</p>
            </>
          )}
          {form.payment === "GCASH" && (
            <>
              <p className="font-semibold text-gray-800">GCash</p>
              <p className="text-gray-600">Account Name: Nina May Calusin</p>
              <p className="text-gray-600">Mobile Number: 09952849906</p>
            </>
          )}
        </div>
      </div>

      {/* === Proof Upload === */}
      <div className="mt-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Upload Payment Proof
        </label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) =>
            setForm({ ...form, proofFile: e.target.files?.[0] || null })
          }
          className="w-full text-sm"
        />
      </div>

      {/* === Submit Button === */}
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white py-2 px-4 rounded-lg w-full font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all"
      >
        {loading ? "Submitting…" : "Place Order"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        🚚 Delivery will be booked via Lalamove. You'll pay the delivery fee
        directly to the rider upon arrival.
      </p>
    </form>
  );
}

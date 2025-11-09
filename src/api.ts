import { supabase } from "./lib/supabase";
import type { AddOn, Product, OrderPayload } from "./types";

export async function fetchMenu() {
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);
  if (pErr) throw pErr;
  const { data: addons, error: aErr } = await supabase
    .from("addons")
    .select("*");
  if (aErr) throw aErr;
  return { products: products as Product[], addons: addons as AddOn[] };
}

export async function placeOrder(payload: OrderPayload) {
  // Client-side insert sequence (MVP). For stricter integrity, move to a Postgres RPC later.
  const total = await computeTotal(payload);
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      customer_name: payload.customer_name,
      contact_number: payload.contact_number,
      delivery_address: payload.delivery_address,
      notes: payload.notes,
      payment_method: payload.payment_method,
      proof_url: payload.proof_url ?? null,
      total_cents: total,
      status: "PENDING",
    })
    .select("id")
    .single();
  if (oErr) throw oErr;

  for (const it of payload.items) {
    const { data: itemRow, error: iErr } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
      })
      .select("id")
      .single();
    if (iErr) throw iErr;
    for (const a of it.addons) {
      const { error: aErr } = await supabase.from("order_item_addons").insert({
        order_item_id: itemRow.id,
        addon_id: a.addon_id,
        quantity: a.quantity,
      });
      if (aErr) throw aErr;
    }
  }
  return order.id;
}

async function computeTotal(payload: OrderPayload) {
  let total = 0;
  // Fetch current prices from DB for safety
  const prodIds = payload.items.map((i) => i.product_id);
  const addIds = payload.items.flatMap((i) => i.addons.map((a) => a.addon_id));
  const { data: prods } = await supabase
    .from("products")
    .select("id,price_cents")
    .in("id", prodIds);
  const { data: adds } = await supabase
    .from("addons")
    .select("id,price_cents")
    .in(
      "id",
      addIds.length ? addIds : ["00000000-0000-0000-0000-000000000000"]
    );
  const pmap = new Map(prods?.map((p) => [p.id, p.price_cents]) ?? []);
  const amap = new Map(adds?.map((a) => [a.id, a.price_cents]) ?? []);
  for (const it of payload.items) {
    total += (pmap.get(it.product_id) ?? 0) * it.quantity;
    for (const a of it.addons)
      total += (amap.get(a.addon_id) ?? 0) * it.quantity * a.quantity;
  }
  return total;
}

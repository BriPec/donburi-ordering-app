import { useEffect, useState } from "react";
import { useCart } from "../store/cart";
import { fetchMenu } from "../api";

export default function Menu() {
  const { addItem, addAddon } = useCart();
  const [menu, setMenu] = useState<{ products: any[]; addons: any[] } | null>(
    null
  );
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: string[];
  }>({});
  // Track egg style per product/addon
  const [eggStyles, setEggStyles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchMenu().then(setMenu).catch(console.error);
  }, []);

  if (!menu)
    return <p className="text-center py-10 text-gray-500">Loading menu…</p>;

  const toggleAddon = (productId: string, addonId: string) => {
    setSelectedAddons((prev) => {
      const current = prev[productId] || [];
      const isEgg = menu?.addons
        .find((a) => a.id === addonId)
        ?.name.toLowerCase()
        .includes("egg");
      // Remove egg style if egg is deselected
      if (current.includes(addonId) && isEgg) {
        setEggStyles((es) => {
          const copy = { ...es };
          delete copy[`${productId}-${addonId}`];
          return copy;
        });
      }
      return {
        ...prev,
        [productId]: current.includes(addonId)
          ? current.filter((id) => id !== addonId)
          : [...current, addonId],
      };
    });
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    const addonsForThis = selectedAddons[product.id] || [];
    for (const addonId of addonsForThis) {
      const addon = menu!.addons.find((a) => a.id === addonId);
      if (addon) {
        const isEgg = addon.name.toLowerCase().includes("egg");
        const eggStyle = isEgg
          ? eggStyles[`${product.id}-${addonId}`]
          : undefined;
        addAddon(product.id, addon, eggStyle);
      }
    }
    // reset selection and egg styles for that product
    setSelectedAddons((prev) => ({ ...prev, [product.id]: [] }));
    setEggStyles((prev) => {
      const copy = { ...prev };
      for (const addonId of addonsForThis) {
        delete copy[`${product.id}-${addonId}`];
      }
      return copy;
    });
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold text-orange-500">Menu</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.products
          .filter((p) => p.category === "Donburi")
          .map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
            >
              <img
                src={product.image_url || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.description}
                </p>
                <p className="text-orange-500 font-semibold mb-3">
                  ₱{(product.price_cents / 100).toFixed(2)}
                </p>

                {/* === Add-ons Selector === */}
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Add-ons:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {menu.addons.map((addon) => {
                      const isEgg = addon.name.toLowerCase().includes("egg");
                      const selected = selectedAddons[product.id]?.includes(
                        addon.id
                      );
                      return (
                        <div
                          key={addon.id}
                          className="flex flex-col items-start"
                        >
                          <button
                            onClick={() => toggleAddon(product.id, addon.id)}
                            className={`text-xs border px-2 py-1 rounded ${
                              selected
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-300 hover:border-orange-400"
                            }`}
                          >
                            {addon.name} (+₱
                            {(addon.price_cents / 100).toFixed(0)})
                          </button>
                          {/* Egg style dropdown if egg is selected */}
                          {isEgg && selected && (
                            <select
                              value={
                                eggStyles[`${product.id}-${addon.id}`] ||
                                "Scrambled"
                              }
                              onChange={(e) =>
                                setEggStyles((prev) => ({
                                  ...prev,
                                  [`${product.id}-${addon.id}`]: e.target.value,
                                }))
                              }
                              className="mt-1 border rounded p-1 text-xs w-full"
                            >
                              <option>Scrambled</option>
                              <option>Soft-Boiled</option>
                              <option>Poached</option>
                              <option>Sunny Side Up</option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* === Add to Cart === */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 bg-orange-500 text-white px-3 py-2 rounded-lg w-full font-medium hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

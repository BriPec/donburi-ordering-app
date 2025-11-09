import { useCart } from "../store/cart";
import { cents } from "../store/utils";

export default function Cart({ onCheckout }: { onCheckout: () => void }) {
  const {
    items,
    total,
    clear,
    setQty,
    removeItem,
    removeAddon,
    updateAddonQty,
  } = useCart();

  if (!items.length)
    return (
      <aside className="p-4 text-sm text-gray-500">Your cart is empty.</aside>
    );

  return (
    <aside className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold mb-3 text-orange-500">Your Cart</h3>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.product.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{it.product.name}</span>

              {/* Remove Don */}
              <button
                onClick={() => removeItem(it.product.id)}
                className="text-red-500 text-xs font-medium hover:underline"
              >
                Remove
              </button>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center mt-2 gap-2">
              <button
                onClick={() => setQty(it.product.id, it.quantity - 1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                −
              </button>
              <span className="font-semibold">{it.quantity}</span>
              <button
                onClick={() => setQty(it.product.id, it.quantity + 1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Add-ons */}
            {it.addons.length > 0 && (
              <ul className="mt-2 pl-4 border-l border-orange-100 space-y-1">
                {it.addons.map((a) => (
                  <li
                    key={a.addon.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {a.addon.name}
                      {/* Show egg style if present */}
                      {a.eggStyle &&
                        a.addon.name.toLowerCase().includes("egg") && (
                          <span className="ml-1 text-gray-500">
                            ({a.eggStyle})
                          </span>
                        )}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Quantity controls for addon */}
                      <button
                        onClick={() =>
                          updateAddonQty(
                            it.product.id,
                            a.addon.id,
                            a.quantity - 1
                          )
                        }
                        className="px-2 border rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span>{a.quantity}</span>
                      <button
                        onClick={() =>
                          updateAddonQty(
                            it.product.id,
                            a.addon.id,
                            a.quantity + 1
                          )
                        }
                        className="px-2 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>

                      {/* Remove addon */}
                      <button
                        onClick={() => removeAddon(it.product.id, a.addon.id)}
                        className="ml-2 text-red-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Cart Total */}
      <div className="mt-4 flex justify-between font-semibold text-gray-800">
        <span>Total</span>
        <span className="text-orange-500 text-lg">{cents(total())}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={clear}
          className="text-sm text-gray-500 hover:text-red-500 underline"
        >
          Clear Cart
        </button>
        <button
          onClick={onCheckout}
          className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Place Order
        </button>
      </div>
    </aside>
  );
}

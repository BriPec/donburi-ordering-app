import { useState } from "react";
import type { AddOn } from "../types";

interface Props {
  addon: AddOn;
  onAdd: (addon: AddOn, eggStyle?: string) => void;
}

export default function AddOnPicker({ addon, onAdd }: Props) {
  const [eggStyle, setEggStyle] = useState("Scrambled");

  const handleAdd = () => {
    if (addon.name.toLowerCase().includes("egg")) {
      onAdd(addon, eggStyle);
    } else {
      onAdd(addon);
    }
  };

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="font-semibold">{addon.name}</div>
        <div className="text-sm text-gray-600 mb-1">
          ₱{(addon.price_cents / 100).toFixed(2)}
        </div>

        {addon.name.toLowerCase().includes("egg") && (
          <select
            value={eggStyle}
            onChange={(e) => setEggStyle(e.target.value)}
            className="border rounded p-1 text-sm mt-1 w-full"
          >
            <option>Scrambled</option>
            <option>Soft-Boiled</option>
            <option>Poached</option>
            <option>Sunny Side Up</option>
          </select>
        )}
      </div>

      <button
        onClick={handleAdd}
        className="mt-2 bg-black text-white text-sm rounded py-1 hover:bg-gray-800"
      >
        Add
      </button>
    </div>
  );
}

import { useState, Fragment } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import { Dialog, Transition } from "@headlessui/react";

export default function App() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* === Header === */}
      <Header />

      {/* === Main Content === */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[2fr_1fr] gap-8">
        {/* Menu Section */}
        <section className="space-y-6">
          <Menu />
        </section>

        {/* Cart Section */}
        <aside className="space-y-6">
          {/* The Cart now opens checkout modal on click */}
          <Cart onCheckout={() => setCheckoutOpen(true)} />
        </aside>
      </main>

      {/* === Footer === */}
      <footer className="text-center text-xs py-8 text-gray-500 border-t bg-white/70 backdrop-blur-sm">
        © {new Date().getFullYear()} {import.meta.env.VITE_STORE_NAME}. All
        rights reserved.
      </footer>

      {/* === Checkout Modal === */}
      <Transition appear show={isCheckoutOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setCheckoutOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-orange-100">
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-orange-500 mb-4 text-center"
                  >
                    Checkout Your Donburi 🍱
                  </Dialog.Title> */}

                  {/* ✅ CheckoutForm with close callback */}
                  <CheckoutForm onClose={() => setCheckoutOpen(false)} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

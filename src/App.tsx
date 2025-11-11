import { useState, Fragment } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import { Dialog, Transition } from "@headlessui/react";

export default function App() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
                  <CheckoutForm
                    onClose={() => setCheckoutOpen(false)}
                    onSuccess={() => {
                      setCheckoutOpen(false);
                      setShowSuccessModal(true);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* === Success Modal === */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Order Placed Successfully!
              </h3>
              <p className="text-gray-600 mb-8 text-base">
                Thank you for your order! We'll contact you soon to confirm
                delivery via Lalamove.
              </p>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = "/";
                }}
                className="bg-orange-500 text-white py-3 px-8 rounded-lg w-full font-semibold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

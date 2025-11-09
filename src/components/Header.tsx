export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-orange-100 shadow-sm">
      <div className="h-1 bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-accent">
          {import.meta.env.VITE_STORE_NAME}
        </h1>
        <a
          href={`tel:${import.meta.env.VITE_STORE_PHONE}`}
          className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
        >
          Call Us
        </a>
      </div>
    </header>
  );
}

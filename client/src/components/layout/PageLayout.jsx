import Header from './Header';

function PageLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#060a16] text-slate-200 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.14),transparent_65%)]"
      />

      <Header />

      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default PageLayout;

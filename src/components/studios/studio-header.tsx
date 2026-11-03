
export default function StudioHeader() {
  return (
    <section className="border-b border-[#EAE7E2] bg-white transition-colors duration-300 dark:border-[#303B3E] dark:bg-[#1C2629]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-[2px] w-9 bg-[#F16F50]" />

          <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
            Explore Creative Spaces
          </p>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-5xl lg:text-6xl">
          Find your next
          <span className="block text-[#F16F50]">
            creative space.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-[#777D7D] dark:text-[#A1AAAA] sm:text-lg">
          Discover inspiring studios, professional production
          spaces and creative environments built for your next
          big idea.
        </p>
      </div>
    </section>
  );
}

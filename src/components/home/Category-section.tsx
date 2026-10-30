
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: "01",
    title: "Photo Studios",
    description: "Perfect spaces for every frame and photoshoot.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "02",
    title: "Sound Stages",
    description: "Production-ready spaces for film and video.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "03",
    title: "Podcast Rooms",
    description: "Inspiring rooms for conversations and stories.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "04",
    title: "Music Suites",
    description: "Spaces to record, mix and create music.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "05",
    title: "Art Workshops",
    description: "Creative environments for artistic minds.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
  },
];

export default function CategorySection() {
  return (
    <section
      id="categories"
      className="bg-[#F5F3EE] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">

        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div className="max-w-2xl">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
                Explore Creative Spaces
              </p>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-[-1.5px] text-[#202729] sm:text-5xl lg:text-6xl">
              Find your kind of
              <span className="block text-[#F16F50]">
                creative space.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#727A77] sm:text-lg">
              From professional photography studios to creative
              recording spaces, discover the perfect environment
              for bringing your ideas to life.
            </p>

          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#202729]/30 pb-2 text-sm font-bold text-[#202729] transition-colors hover:border-[#F16F50] hover:text-[#F16F50]"
          >
            Explore All Spaces

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/studios?category=${encodeURIComponent(category.title)}`}
              aria-label={`Explore ${category.title}`}
              className="group relative h-[340px] overflow-hidden rounded-2xl bg-[#202729] sm:h-[380px] xl:h-[400px]"
            >

              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url("${category.image}")`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#101717]/90 via-[#101717]/20 to-[#101717]/10 transition-colors duration-300 group-hover:from-[#101717]/95" />

              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">

                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-white backdrop-blur-md">
                  Creative Space
                </span>

                <span className="text-sm font-bold text-white/70">
                  {category.id}
                </span>

              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">

                <div className="mb-4 h-[2px] w-9 bg-[#F16F50] transition-all duration-300 group-hover:w-16" />

                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {category.title}
                </h3>

                <p className="mt-3 max-w-[230px] text-sm leading-6 text-white/75">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Explore Category
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-[#F16F50] group-hover:bg-[#F16F50] group-hover:text-white">
                    <ArrowUpRight size={19} />
                  </span>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

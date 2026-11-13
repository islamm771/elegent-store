import { ArrowRightIcon } from "@/ui";
import Link from "next/link";
import { Photo } from "./Photo";

const CategoryCard = ({ c, counts }: { c: category; counts: Record<string, number> }) => {
  return (
    <Link href={c.href} className="group block">
      <Photo src={c.image} tone={c.tone} alt={c.title}
        className="flex flex-col h-46.25 justify-end rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:h-90">
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent via-50% to-transparent transition-opacity group-hover:opacity-90" />
        <div className="relative flex flex-col items-start gap-0.5 p-4">
          <p className="text-[9px] font-medium uppercase leading-4 tracking-wider text-[#EFE8DC] lg:text-[11px]">{counts[c.id] ?? 0} pieces</p>
          <h3 className="font-serif text-white text-base leading-5.5 lg:text-2xl lg:leading-8">{c.title}</h3>
          <p className="flex items-center gap-1 text-[10px] uppercase leading-4 tracking-widset text-peach lg:text-[11px]">
            Shop now <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </Photo>
    </Link>
  )
}

export default CategoryCard
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  title: string
  description: string
  href: string
  productCount?: number
  priceFrom?: string
  category?: string
  image?: string
}

export default function ProductCard({
  title,
  description,
  href,
  productCount,
  priceFrom,
  category,
  image,
}: ProductCardProps) {
  return (
    <article
      className="bg-white overflow-hidden flex flex-col group hover:-translate-y-[3px] transition-transform duration-[250ms] ease-out"
      style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}
      aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden relative bg-cloud">
        {image ? (
          <Image
            src={image}
            alt={`${title} — hospitality-grade supplies from Dozen`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-cloud flex items-center justify-center">
            <span className="text-xs font-body font-bold uppercase tracking-[0.1em] text-bark">
              {category}
            </span>
          </div>
        )}

        {category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-body font-bold uppercase tracking-[0.1em] bg-white/90 text-onyx backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 border border-cloud border-t-0">
        {productCount !== undefined && (
          <p className="text-xs font-body font-bold uppercase tracking-[0.1em] text-gold mb-2">
            {productCount} SKUs
          </p>
        )}

        <h3
          id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-xl font-heading font-semibold text-onyx leading-snug mb-3"
        >
          {title}
        </h3>

        <p className="text-sm font-body text-bark leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {priceFrom && (
          <p className="text-xs font-body font-bold uppercase tracking-[0.08em] text-bark mb-4">
            {priceFrom} — indicative pricing
          </p>
        )}

        <Link
          href={href}
          className="text-xs font-body font-bold uppercase tracking-[0.1em] text-gold hover:text-gold-warm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none self-start group/link"
        >
          View Range{' '}
          <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  )
}

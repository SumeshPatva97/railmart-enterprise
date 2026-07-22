import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQSection } from '@/components/home/FAQSection';

export default function HomePage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts />
      <Testimonials />
      <FAQSection />
    </div>
  );
}

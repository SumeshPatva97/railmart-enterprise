import { HeroBanner } from '@/components/home/HeroBanner';
import { AnimatedStats } from '@/components/home/AnimatedStats';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQSection } from '@/components/home/FAQSection';
import { ScrollReveal } from '@/components/common/ScrollReveal';

export default function HomePage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <HeroBanner />
      <AnimatedStats />
      
      <ScrollReveal direction="up" delay={0.1}>
        <CategoryShowcase />
      </ScrollReveal>

      <FeaturedProducts />

      <ScrollReveal direction="up" delay={0.1}>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <FAQSection />
      </ScrollReveal>
    </div>
  );
}

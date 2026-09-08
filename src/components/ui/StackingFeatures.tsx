import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Shield, Clock, Globe2, FileCheck, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: 'Quick Registration',
    description: 'Get on the water faster. Our expedited services ensure minimal wait times, cutting through red tape so you can set sail without delay.',
    icon: Clock,
    color: '#0E4B82', // Ocean Blue
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Easy Processing',
    description: 'A completely streamlined and transparent workflow. We handle all the complex paperwork and submissions, so you only need to handle the helm.',
    icon: FileCheck,
    color: '#081C3A', // Primary Navy
    image: '/coastal_highway.png',
  },
  {
    title: 'Global Recognition',
    description: 'Gain access to the most prestigious flag states globally. We navigate the intricacies of international waters to secure the best jurisdiction for your vessel.',
    icon: Globe2,
    color: '#CDA349', // Luxury Gold
    image: '/globe_tree.png',
  },
  {
    title: 'Legal Compliance',
    description: '100% compliant with international maritime laws. Benefit from our enterprise-grade security and decades of legal expertise protecting your maritime assets.',
    icon: Shield,
    color: '#14B86A', // Success Green
    image: '/legal_compliance.png',
  },
  {
    title: '24/7 Concierge Support',
    description: 'Our dedicated concierge team is available around the clock. Whether you are anchored in the Med or sailing the Pacific, we are here to support your journey.',
    icon: CheckCircle2,
    color: '#081C3A', // Primary Navy
    image: '/concierge_support.png',
  },
];

interface CardProps {
  key?: React.Key;
  i: number;
  total: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  image: string;
  progress: MotionValue<number>;
}

const Card = ({
  i,
  total,
  title,
  description,
  icon: Icon,
  color,
  image,
  progress,
}: CardProps) => {
  // Pacing:
  // Card 0: already in position
  // Card 1: enters 0.10 -> 0.23
  // Card 2: enters 0.23 -> 0.36
  // Card 3: enters 0.36 -> 0.49
  // Card 4 (LAST TILE: Concierge Support): enters 0.49 -> 0.62
  // Generous settling buffer: from 0.62 to 1.0 (38% of total scroll distance),
  // Card 4 stays completely settled, visible, and stacked on top of the deck!
  const enterStart = i === 0 ? 0 : 0.10 + (i - 1) * 0.13;
  const enterEnd = i === 0 ? 0 : 0.10 + i * 0.13;

  const entryY = useTransform(
    progress,
    [enterStart, Math.max(enterStart + 0.02, enterEnd)],
    [i === 0 ? '0%' : '100vh', '0%']
  );

  // Scaling: cards underneath scale down gently as cards stack on top
  const targetScale = 1 - (total - 1 - i) * 0.03;
  const scale = useTransform(
    progress,
    [enterEnd, Math.min(enterEnd + 0.35, 0.65)],
    [1, i === total - 1 ? 1 : targetScale]
  );

  return (
    <motion.div
      style={{
        scale,
        y: i === 0 ? 0 : entryY,
        top: `calc(8px + ${i * 13}px)`,
      }}
      className="absolute pointer-events-auto w-[90%] md:w-[70%] max-w-sm sm:max-w-md md:max-w-3xl h-[345px] sm:h-[330px] md:h-[310px] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-gray-100/90 origin-top bg-white"
    >
      <div className="flex flex-col md:flex-row w-full h-full bg-white">
        {/* Content Side */}
        <div className="order-2 md:order-1 w-full md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col justify-center relative bg-white z-10 flex-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
            style={{ backgroundColor: color }}
          />

          <div
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-2.5 md:mb-4 shadow-sm text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-5 h-5" />
          </div>

          <h3 className="text-base sm:text-lg md:text-2xl font-heading font-bold text-[#081C3A] mb-1.5 md:mb-2 leading-tight">
            {title}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
            {description}
          </p>
        </div>

        {/* Image Side */}
        <div className="order-1 md:order-2 w-full md:w-1/2 h-32 sm:h-36 md:h-full relative overflow-hidden bg-gray-100 shrink-0">
          <div className="absolute inset-0 bg-black/5 z-10" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function StackingFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="bg-[var(--color-background)] relative" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start overflow-hidden pointer-events-none pt-16 md:pt-20">
        {/* Title Header */}
        <div className="text-center px-4 mb-2 md:mb-4 pointer-events-auto shrink-0">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-[var(--color-primary-navy)] mb-1 md:mb-2">
            Why Choose Felix Yacht
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            Experience seamless international yacht registration with our premium services.
          </p>
        </div>

        {/* Cards Stacking Area */}
        <div className="relative w-full flex-1 flex justify-center items-start">
          {features.map((feature, i) => (
            <Card
              key={i}
              i={i}
              total={features.length}
              {...feature}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

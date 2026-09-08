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
  // Pacing calculations: 5 cards with smooth sequential entry and progressive scale down
  const enterStart = i === 0 ? 0 : (i - 1) * 0.18 + 0.04;
  const enterEnd = i === 0 ? 0 : i * 0.18;

  const entryY = useTransform(
    progress,
    [enterStart, Math.max(enterStart + 0.01, enterEnd)],
    [i === 0 ? '0%' : '100%', '0%']
  );

  const scaleStart = i * 0.18;
  const scaleEnd = 0.85;
  const targetScale = 1 - (total - 1 - i) * 0.035;

  const scale = useTransform(
    progress,
    [scaleStart, Math.max(scaleStart + 0.1, scaleEnd)],
    [1, targetScale]
  );

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0 px-4 pointer-events-none">
      <motion.div
        style={{
          scale,
          y: i === 0 ? 0 : entryY,
        }}
        className="pointer-events-auto flex flex-col relative w-full max-w-[340px] sm:max-w-md md:max-w-3xl rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100/80 origin-top bg-white"
      >
        <div className="flex flex-col md:flex-row w-full h-[370px] sm:h-[390px] md:h-[320px] bg-white">
          {/* Text Content */}
          <div className="order-2 md:order-1 w-full md:w-1/2 p-5 sm:p-6 md:p-10 flex flex-col justify-center relative bg-white z-10 flex-1">
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
              style={{ backgroundColor: color }}
            />

            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2.5 md:mb-5 shadow-sm text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-[#081C3A] mb-1.5 md:mb-3 leading-tight">
              {title}
            </h3>

            <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
              {description}
            </p>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 w-full md:w-1/2 h-40 sm:h-44 md:h-full relative overflow-hidden bg-gray-100 shrink-0">
            <div className="absolute inset-0 bg-black/5 z-10" />
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function StackingFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className="bg-[var(--color-background)] relative">
      {/* Title Header - Sticks cleanly at top as cards scroll over */}
      <div className="pb-8 pt-8 md:pt-12 text-center sticky top-14 md:top-16 z-0 pointer-events-none px-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-[var(--color-primary-navy)] mb-2">
          Why Choose Felix Yacht
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
          Experience seamless international yacht registration with our premium services.
        </p>
      </div>

      {/* Stacking Cards Container */}
      <div ref={containerRef} className="relative z-10" style={{ height: '320vh' }}>
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
    </section>
  );
}

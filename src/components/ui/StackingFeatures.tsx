import { useRef } from 'react';
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
  i: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  image: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card = ({ i, title, description, icon: Icon, color, image, progress, range, targetScale }: CardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Cards enter from the bottom when they become active in the scroll
  // Card 0 is always there. Card 1 enters from 0.2 to 0.4.
  const yEntryRange = [range[0] - 0.15, range[0]];
  const y = useTransform(progress, yEntryRange, ['100vh', '0vh']);
  
  // Actually, a simpler way is to just use useTransform directly based on the index.
  // Let's refine the y translation for entry. If it's the first card, it shouldn't animate in from the bottom while scrolling, it's just there.
  const entryY = useTransform(progress, [range[0] - 0.2, range[0]], ['100%', '0%']);

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ 
          scale, 
          top: `calc(15vh + ${i * 20}px)`, 
          y: i === 0 ? 0 : entryY 
        }}
        className="flex flex-col relative w-[70%] max-w-3xl h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 origin-top"
      >
        <div className="flex flex-col md:flex-row w-full h-full bg-white">
          
          {/* Content Side */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative bg-white z-10">
            {/* Background Accent */}
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
              style={{ backgroundColor: color }}
            />
            
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-md text-white"
              style={{ backgroundColor: color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#081C3A] mb-4 leading-tight">
              {title}
            </h3>
            
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Image Side */}
          <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 z-10" />
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
      <div className="pb-24 pt-8 text-center sticky top-0 z-0 h-screen flex flex-col items-center justify-start pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-heading font-bold text-[var(--color-primary-navy)] mb-6">
          Why Choose Felix Yacht
        </h2>
        <p className="text-gray-500 max-w-4xl mx-auto text-xl px-4">
          Experience seamless international yacht registration with our premium services.
        </p>
      </div>
      
      <div ref={containerRef} className="relative z-10" style={{ height: '500vh' }}>
        {features.map((feature, i) => {
          // Calculate the range for when THIS card should start scaling down
          // If we have 5 cards (0-4), Card 0 scales down from 0 to 1.
          // Card 1 scales down from 0.25 to 1.
          // Card 2 scales down from 0.5 to 1.
          const range = [i * 0.25, 1];
          const targetScale = 1 - ((features.length - i) * 0.04);
          
          return (
            <Card 
              key={i}
              i={i}
              {...feature}
              progress={scrollYProgress}
              range={range as [number, number]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

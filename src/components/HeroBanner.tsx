// src/components/HeroBanner.tsx - Refactored to fetch from Supabase
import Autoplay from "embla-carousel-autoplay";
import banner1 from "@/assets/banner1.gif";
import banner2 from "@/assets/banner2.gif";
import banner3 from "@/assets/banner3.gif";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";

export default function HeroBanner() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  // Default banners if no Supabase data
  const defaultBanners = [
    { id: '1', image_url: banner1, title: 'Nature & Science' },
    { id: '2', image_url: banner2, title: 'Aromatherapy' },
    { id: '3', image_url: banner3, title: 'Courses' },
  ];

  const displayBanners = defaultBanners;

  return (
    <section className="relative w-full bg-white flex justify-center py-6">
      <div className="container mx-auto px-4 md:px-12 max-w-[1480px]">
        <Carousel
          plugins={[plugin.current]}
          className="w-full rounded-2xl overflow-hidden shadow-sm"
          opts={{
            loop: true,
            align: "start",
          }}
        >
        <CarouselContent className="-ml-0">
          {displayBanners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0 basis-full">
              <div className="w-full h-auto">
                <img 
                  src={banner.image_url} 
                  alt={banner.title || "Banner"} 
                  className="w-full h-auto object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
          <CarouselPrevious className="left-4 w-10 h-10 bg-white/30 hover:bg-white/50 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="right-4 w-10 h-10 bg-white/30 hover:bg-white/50 border-none text-white backdrop-blur-sm" />
        </Carousel>
      </div>
    </section>
  );
}

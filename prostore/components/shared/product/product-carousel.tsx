"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

interface ProductCarouselProps {
  data: Product[];
}

export default function ProductCarousel({ data }: ProductCarouselProps) {
  return (
    <Carousel
      className="w-full mt-2 mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                {product.banner ? (
                  <Image
                    src={product.banner}
                    alt={product.name}
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex items-end justify-center">
                <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                  {product.name}
                </h2>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

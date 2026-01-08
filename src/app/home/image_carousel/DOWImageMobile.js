"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

export default function CarouselDemo() {

    const router = useRouter();
``
  const images = [
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/1m.avif",
      alt: "stock",
      url: '/category/fruits-vegetables'
    },
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/2m.avif",
      alt: "stock",
      url: '/category/snacks-branded-foods'

    },
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/pothys-original/3m.avif",
      alt: "stock",
      url: '/category/cleaning-household'
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Auto-scroll effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4s interval
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="my-2 w-full h-full flex justify-center items-center overflow-hidden">
      <Carousel className="w-full max-w-4xl h-fit">
        <CarouselContent
          className="w-full h-fit transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="w-full h-full flex-none"
              style={{ flex: "0 0 100%" }}
            >
              <div className="w-full h-full">
                <Card className="w-full h-full rounded-none border-none shadow-none p-0">
                  <CardContent className="w-full h-full p-0 -z-20">
                    <img
                      src={image.src}
                      alt={image.alt}
                      onClick={() => router.push(image.url)}
                      className="w-full h-full object-cover -z-10"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

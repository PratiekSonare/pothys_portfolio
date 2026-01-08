"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselDemo() {
  const images = [
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/premium_photo-1701554945317-0d77b5e9afc6.avif",
      alt: "stock",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/blue-gradient.avif",
      alt: "stock",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/premium_photo-1701842912770-09385be81409.avif",
      alt: "stock",
    },
  ];

  return (
    <Carousel className="w-full h-full ">
      <CarouselContent
      opts={{
        align: "start",
        slidesToScroll: 1,
      }}
      className="w-full h-full"
      >
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex items-center justify-center p-0">
              <Card className="w-full md:w-3/4 h-auto">
                <CardContent className="w-full h-full p-0">
                  <div className="flex items-center justify-center">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import { normalizeGalleryImageUrl } from "@/lib/gallery-image-url";
import { useReveal } from "@/hooks/use-reveal";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Cycle through different elegant aspect ratios to create a masonry-style editorial look
const ASPECT_RATIOS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]"];

function GalleryCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const ref = useReveal();
  const aspectRatioClass = ASPECT_RATIOS[index % ASPECT_RATIOS.length];
  const isSignature = index % 5 === 0; // Every 5th item gets an elegant badge

  return (
    <figure
      ref={ref}
      onClick={onClick}
      className="reveal-soft mb-6 break-inside-avoid cursor-pointer group"
    >
      <div className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-3xl bg-cream-200 shadow-md transition-shadow hover:shadow-xl active:scale-[0.98] active:opacity-90 duration-300`}>
        <Image
          src={normalizeGalleryImageUrl(item.imageUrl)}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        {isSignature && (
          <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 shadow-sm">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cocoa-700">Signature</p>
          </div>
        )}
      </div>
      <figcaption className="p-3">
        <p className="font-serif text-lg text-cocoa-700 group-hover:text-blush-500 transition-colors">{item.title}</p>
        <p className="text-[0.65rem] uppercase tracking-widest text-blush-400 mt-1">
          {item.category.replace("_", " ")}
        </p>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => setSelectedIndex(null), []);
  
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === items.length - 1 ? 0 : prev! + 1));
  }, [selectedIndex, items.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === 0 ? items.length - 1 : prev! - 1));
  }, [selectedIndex, items.length]);

  // Keyboard navigation for Modal
  useEffect(() => {
    if (selectedIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex, handleClose, handleNext, handlePrev]);

  return (
    <>
      <div className="mt-12 columns-2 gap-4 md:gap-6 lg:columns-3 xl:columns-4">
        {items.map((item, idx) => (
          <GalleryCard 
            key={item.id} 
            item={item} 
            index={idx} 
            onClick={() => setSelectedIndex(idx)} 
          />
        ))}
      </div>

      {/* Fullscreen Modal Viewer */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm opacity-100 transition-opacity"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors p-2"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition-colors p-4"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          <button 
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition-colors p-4"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>

          {/* Image Container */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[85vh] mx-auto px-4 md:px-24 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent click-through closing
          >
            <div className="relative w-full h-full">
              <Image
                src={normalizeGalleryImageUrl(items[selectedIndex].imageUrl)}
                alt={items[selectedIndex].title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-[-2rem] left-0 w-full text-center">
              <p className="font-serif text-2xl text-cream-100">{items[selectedIndex].title}</p>
              {items[selectedIndex].description && (
                <p className="text-sm font-light text-cream-200/70 mt-2 max-w-lg mx-auto">
                  {items[selectedIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

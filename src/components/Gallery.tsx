import { useEffect, useState, useCallback } from "react";
import { fetchImages, getOptimizedImageUrl } from "../services/picsumApi";
import {
  packImagesIntoRows,
  getResponsiveDimensions,
} from "../utils/galleryHelpers";
import type { ImageWithCalculatedWidth, ImageRow } from "../types";
import "../styles/Gallery.css";

export const Gallery = () => {
  const [imageRows, setImageRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [images, setImages] = useState<ImageWithCalculatedWidth[]>([]);

  const repackImages = useCallback(
    (newWidth: number, newHeight: number) => {
      if (images.length > 0) {
        const updatedImages = images.map((image) => {
          const { url, calculatedWidth } = getOptimizedImageUrl(
            image,
            newHeight
          );
          return {
            ...image,
            calculatedWidth,
            optimizedUrl: url,
          };
        });

        const rows = packImagesIntoRows(updatedImages, newWidth, newHeight);
        setImageRows(rows);
      }
    },
    [images]
  );

  useEffect(() => {
    const handleResize = () => {
      const { maxWidth, targetHeight: newHeight } = getResponsiveDimensions();
      setContainerWidth(maxWidth);
      repackImages(maxWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [images, repackImages]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchImages(30);

        const { maxWidth, targetHeight: initialHeight } =
          getResponsiveDimensions();
        setContainerWidth(maxWidth);

        const imagesWithWidths = result.map((image) => {
          const { url, calculatedWidth } = getOptimizedImageUrl(
            image,
            initialHeight
          );
          const aspectRatio = image.width / image.height;
          return {
            ...image,
            calculatedWidth,
            optimizedUrl: url,
            aspectRatio,
          };
        });

        setImages(imagesWithWidths);

        const rows = packImagesIntoRows(
          imagesWithWidths,
          maxWidth,
          initialHeight
        );
        setImageRows(rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return <div className="gallery-loading">Loading images...</div>;
  }

  if (error) {
    return <div className="gallery-error">Error: {error}</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-rows" style={{ maxWidth: `${containerWidth}px` }}>
        {imageRows.map((row, rowIndex) => (
          <div key={rowIndex} className="gallery-row">
            {row.images.map((image) => (
              <div
                key={image.id}
                className="image-card"
                style={{ width: `${image.calculatedWidth}px` }}
              >
                <div className="image-card__container">
                  <img
                    src={image.optimizedUrl}
                    alt={`Photo by ${image.author}`}
                    className="image-card__image"
                    loading="lazy"
                  />
                  <div className="image-card__author">
                    <span className="image-card__author-text">
                      {image.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

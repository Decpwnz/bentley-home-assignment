import { useEffect, useState, useCallback } from "react";
import { fetchImages, getOptimizedImageUrl } from "../services/picsumApi";
import {
  packImagesIntoRows,
  getResponsiveDimensions,
} from "../utils/galleryHelpers";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { ImageWithCalculatedWidth, ImageRow } from "../types";
import "../styles/Gallery.css";

export const Gallery = () => {
  const [imageRows, setImageRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [images, setImages] = useState<ImageWithCalculatedWidth[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
  }, [repackImages]);

  const loadMoreImages = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const nextPage = currentPage + 1;
      const result = await fetchImages(30, nextPage);

      if (result.length === 0) {
        setHasMore(false);
        return;
      }

      const { maxWidth, targetHeight } = getResponsiveDimensions();

      const newImagesWithWidths = result.map((image) => {
        const { url, calculatedWidth } = getOptimizedImageUrl(
          image,
          targetHeight
        );
        return {
          ...image,
          calculatedWidth,
          optimizedUrl: url,
        };
      });

      const allImages = [...images, ...newImagesWithWidths];
      setImages(allImages);

      const rows = packImagesIntoRows(allImages, maxWidth, targetHeight);
      setImageRows(rows);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more images"
      );
    } finally {
      setLoadingMore(false);
    }
  }, [images, currentPage, loadingMore, hasMore]);

  useEffect(() => {
    const loadInitialImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchImages(30, 1);

        const { maxWidth, targetHeight: initialHeight } =
          getResponsiveDimensions();
        setContainerWidth(maxWidth);

        const imagesWithWidths = result.map((image) => {
          const { url, calculatedWidth } = getOptimizedImageUrl(
            image,
            initialHeight
          );
          return {
            ...image,
            calculatedWidth,
            optimizedUrl: url,
          };
        });

        setImages(imagesWithWidths);

        const rows = packImagesIntoRows(
          imagesWithWidths,
          maxWidth,
          initialHeight
        );
        setImageRows(rows);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadInitialImages();
  }, []);

  const sentinelRef = useInfiniteScroll({
    loading: loadingMore,
    hasMore,
    onLoadMore: loadMoreImages,
    threshold: 200,
  });

  if (loading) {
    return <div className="gallery-loading">Loading images...</div>;
  }

  if (error && images.length === 0) {
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

        {hasMore && (
          <div ref={sentinelRef} className="gallery-loading-more">
            {loadingMore && (
              <div className="gallery-loading-spinner">
                Loading more images...
              </div>
            )}
          </div>
        )}

        {!hasMore && images.length > 0 && (
          <div className="gallery-end">
            <span>You've seen all available photos!</span>
          </div>
        )}
      </div>
    </div>
  );
};

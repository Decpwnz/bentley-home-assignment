import { useEffect, useState } from "react";
import { fetchImages } from "../services/picsumApi";
import { ImageCard } from "./ImageCard";
import type { PicsumImage } from "../types";
import "../styles/Gallery.css";

export const Gallery = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchImages();
        setImages(result);
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
      <div className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

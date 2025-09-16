import { getOptimizedImageUrl } from "../services/picsumApi";
import type { ImageCardProps } from "../types";
import "../styles/ImageCard.css";

export const ImageCard = ({ image, width }: ImageCardProps) => {
  const imageUrl = getOptimizedImageUrl(image, width);

  if (!imageUrl) {
    return <div className="image-card__error">Failed to load image</div>;
  }

  return (
    <div className="image-card">
      <div className="image-card__container">
        <img
          src={imageUrl}
          alt={`Photo by ${image.author}`}
          className="image-card__image"
          loading="lazy"
        />
        <div className="image-card__author">
          <span className="image-card__author-text">{image.author}</span>
        </div>
      </div>
    </div>
  );
};

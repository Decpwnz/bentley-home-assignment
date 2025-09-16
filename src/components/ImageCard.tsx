import { getOptimizedImageUrl } from "../services/picsumApi";
import type { ImageCardProps } from "../types";

export const ImageCard = ({ image, width }: ImageCardProps) => {
  const imageUrl = getOptimizedImageUrl(image, width);

  return (
    <div>
      <div>
        <img src={imageUrl} alt={`Photo by ${image.author}`} loading="lazy" />
        <div>
          <span>{image.author}</span>
        </div>
      </div>
    </div>
  );
};

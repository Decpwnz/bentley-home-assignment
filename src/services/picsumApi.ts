import type { PicsumImage } from "../types";
import { GALLERY_LAYOUT, TARGET_HEIGHTS } from "../constants/layout";

const PICSUM_API_BASE = "https://picsum.photos/v2";

export const fetchImages = async (
  limit: number = GALLERY_LAYOUT.DEFAULT_IMAGE_LIMIT,
  page: number = 1
): Promise<PicsumImage[]> => {
  try {
    const response = await fetch(
      `${PICSUM_API_BASE}/list?limit=${limit}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PicsumImage[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export const getOptimizedImageUrl = (
  image: PicsumImage,
  targetHeight: number = TARGET_HEIGHTS.DESKTOP
): { url: string; calculatedWidth: number } => {
  if (image.height === 0) {
    throw new Error("Invalid image: height cannot be zero");
  }

  const aspectRatio = image.width / image.height;
  const calculatedWidth = Math.round(targetHeight * aspectRatio);
  const url = `https://picsum.photos/id/${image.id}/${calculatedWidth}/${targetHeight}`;

  return {
    url,
    calculatedWidth,
  };
};

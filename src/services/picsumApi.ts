import type { PicsumImage } from "../types";

const PICSUM_API_BASE = "https://picsum.photos/v2";

export const fetchImages = async (
  limit: number = 30
): Promise<PicsumImage[]> => {
  try {
    const response = await fetch(`${PICSUM_API_BASE}/list?limit=${limit}`);

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
  width: number = 300,
  height?: number
): string => {
  const baseUrl = `https://picsum.photos/id/${image.id}`;
  return height ? `${baseUrl}/${width}/${height}` : `${baseUrl}/${width}`;
};

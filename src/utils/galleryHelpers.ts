import type { ImageWithCalculatedWidth, ImageRow } from "../types";

export const packImagesIntoRows = (
  images: ImageWithCalculatedWidth[],
  maxRowWidth: number = 1200,
  targetHeight: number = 250
): ImageRow[] => {
  const rows: ImageRow[] = [];
  let currentRow: ImageWithCalculatedWidth[] = [];
  let currentRowWidth = 0;
  const gap = 15;

  for (const image of images) {
    const imageWidth = image.calculatedWidth;
    const neededWidth =
      currentRowWidth + imageWidth + (currentRow.length > 0 ? gap : 0);

    if (neededWidth <= maxRowWidth || currentRow.length === 0) {
      currentRow.push(image);
      currentRowWidth = neededWidth;
    } else {
      if (currentRow.length > 0) {
        const adjustedRow = adjustRowToFitWidth(
          currentRow,
          maxRowWidth,
          targetHeight,
          gap
        );
        rows.push(adjustedRow);
      }

      currentRow = [image];
      currentRowWidth = imageWidth;
    }
  }

  if (currentRow.length > 0) {
    const adjustedRow = adjustRowToFitWidth(
      currentRow,
      maxRowWidth,
      targetHeight,
      gap
    );
    rows.push(adjustedRow);
  }

  return rows;
};

export const adjustRowToFitWidth = (
  rowImages: ImageWithCalculatedWidth[],
  targetRowWidth: number,
  targetHeight: number,
  gap: number
): ImageRow => {
  const totalGaps = (rowImages.length - 1) * gap;
  const availableWidth = targetRowWidth - totalGaps;
  const currentTotalWidth = rowImages.reduce(
    (sum, img) => sum + img.calculatedWidth,
    0
  );
  const scaleFactor = availableWidth / currentTotalWidth;

  const adjustedImages = rowImages.map((image) => {
    const newWidth = Math.round(image.calculatedWidth * scaleFactor);

    return {
      ...image,
      calculatedWidth: newWidth,
      optimizedUrl: `https://picsum.photos/id/${image.id}/${newWidth}/${targetHeight}`,
    };
  });

  return {
    images: adjustedImages,
    totalWidth: availableWidth,
  };
};

export const getResponsiveDimensions = () => {
  const screenWidth = window.innerWidth;

  let maxWidth;
  if (screenWidth <= 480) {
    maxWidth = screenWidth - 10;
  } else if (screenWidth <= 768) {
    maxWidth = screenWidth - 20;
  } else if (screenWidth <= 1024) {
    maxWidth = screenWidth - 40;
  } else {
    maxWidth = Math.min(1200, screenWidth - 40);
  }

  const targetHeight = screenWidth <= 768 ? 180 : 250;

  return { maxWidth, targetHeight };
};

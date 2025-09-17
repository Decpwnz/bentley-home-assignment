import type { ImageWithCalculatedWidth, ImageRow } from "../types";
import {
  BREAKPOINTS,
  RESPONSIVE_PADDING,
  TARGET_HEIGHTS,
  GALLERY_LAYOUT,
} from "../constants/layout";

export const packImagesIntoRows = (
  images: ImageWithCalculatedWidth[],
  maxRowWidth: number = GALLERY_LAYOUT.MAX_CONTAINER_WIDTH,
  targetHeight: number = TARGET_HEIGHTS.DESKTOP
): ImageRow[] => {
  const rows: ImageRow[] = [];
  let currentRow: ImageWithCalculatedWidth[] = [];
  let currentRowWidth = 0;
  const gap = GALLERY_LAYOUT.IMAGE_GAP;

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
  if (typeof window === "undefined") {
    return {
      maxWidth: GALLERY_LAYOUT.MAX_CONTAINER_WIDTH,
      targetHeight: TARGET_HEIGHTS.DESKTOP,
    };
  }

  const screenWidth = window.innerWidth;

  let maxWidth;
  if (screenWidth <= BREAKPOINTS.MOBILE) {
    maxWidth = screenWidth - RESPONSIVE_PADDING.MOBILE;
  } else if (screenWidth <= BREAKPOINTS.TABLET) {
    maxWidth = screenWidth - RESPONSIVE_PADDING.TABLET;
  } else if (screenWidth <= BREAKPOINTS.DESKTOP) {
    maxWidth = screenWidth - RESPONSIVE_PADDING.DESKTOP;
  } else {
    maxWidth = Math.min(
      GALLERY_LAYOUT.MAX_CONTAINER_WIDTH,
      screenWidth - RESPONSIVE_PADDING.DESKTOP
    );
  }

  const targetHeight =
    screenWidth <= BREAKPOINTS.TABLET
      ? TARGET_HEIGHTS.MOBILE
      : TARGET_HEIGHTS.DESKTOP;

  return { maxWidth, targetHeight };
};

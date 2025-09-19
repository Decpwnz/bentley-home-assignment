export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface ImageWithCalculatedWidth extends PicsumImage {
  calculatedWidth: number;
  optimizedUrl: string;
}

export interface ImageRow {
  images: ImageWithCalculatedWidth[];
}

export interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

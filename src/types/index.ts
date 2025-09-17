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

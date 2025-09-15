import { useEffect, useState } from "react";
import { fetchImages } from "./services/picsumApi";
import type { PicsumImage } from "./types";
import "./App.css";

function App() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImagesData = async () => {
      try {
        const result = await fetchImages();
        setImages(result);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImagesData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Images</h1>
      <p>Found {images.length} images</p>
      {images.map((image) => (
        <div key={image.id}>
          <p>
            <strong>ID:</strong> {image.id}
          </p>
          <p>
            <strong>Author:</strong> {image.author}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;

import { Gallery } from "./components/Gallery";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Gallery</h1>
      </header>
      <main className="app-main">
        <Gallery />
      </main>
    </div>
  );
}

export default App;

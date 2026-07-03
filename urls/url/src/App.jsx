import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const shortenURL = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/shorten", {
        url,
      });

      setShortUrl(response.data.shortUrl);
    } catch (err) {
      alert("Server Error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const copyURL = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to Clipboard!");
  };

  return (
    <div className="container">

      <div className="card">

        <h1>URL Shortener</h1>

        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={shortenURL}>
          {loading ? "Generating..." : "✨ Shorten URL"}
        </button>

        {shortUrl && (
          <div className="result">

            <h3>Short URL</h3>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>

            <div className="btn-group">

              <button onClick={copyURL}>
                📋 Copy
              </button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
              >
                <button>
                  🌍 Open
                </button>
              </a>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;
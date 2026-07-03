import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shortenURL = async () => {

    if (url.trim() === "") {
      alert("Please enter a URL");
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/shorten",
        {
          url: url
        }
      );

      setShortUrl(response.data.shortUrl);

    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }

  };

  return (
    <div className="container">

      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter your URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={shortenURL}>
        Shorten URL
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
        </div>
      )}

    </div>
  );
}

export default App;
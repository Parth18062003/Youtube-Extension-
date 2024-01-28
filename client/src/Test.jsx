import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Main from "./Main";

const Test = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");

  const handleSummarize = async (e) => {
    e.preventDefault();
    try {
      if (!videoUrl) {
        alert("Please enter a YouTube link");
      }
      const response = await axios.post(
        "http://localhost:8080/api/invictus/rusted/summarizer/summary",
        { videoUrl }
      );
      const summary = response.data.summary;
      const url = response.data.videoUrl;
      setUrl(url);
      console.log("test",url);
      setSummary(summary);
      console.log(summary);
      if (response.status === 200) {
        console.log("Video summarized successfully");
        
      } else {
        console.log("Failed to summarize video");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const text = `Q&A Summarizer`.split("");

  return (
    <>
      <div>
        <div className="center">
          <div style={{ background: "transparent" }}>
            <h1 className="heading">Rustube</h1>
          </div>
          <h2 className="sub-heading">
            Youtube{" "}
            {text.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i / 10,
                }}
                key={i}
              >
                {el}
              </motion.span>
            ))}
          </h2>

          <input
            className="input-field"
            type="text"
            placeholder="https://www.youtube.com/watch?v=your-video-id"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <button className="button" onClick={handleSummarize}>
            Summarize
          </button>
          {/*           <div className="summary" style={{ background: "transparent" }}>
            {" "}
            {vidSummary.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i / 10,
                }}
                key={i}
              >
                {el}
              </motion.span>
            ))}
          </div>
          <span style={{ background: "transparent", color: "white" }}>
            <br />
            {summary.includes("Keywords:") && summary.split("Keywords:")[1]}
          </span> */}
        </div>
      </div>
      <Main id="mainComponent" summary={summary} url={url}/>
      {console.log("url", url)}
    </>
  );
};

export default Test;

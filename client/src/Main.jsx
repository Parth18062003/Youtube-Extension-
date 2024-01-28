import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Main = (summary, url) => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  console.log("question:", question )
  const videoUrl = summary
  console.log("url:", url)
  const userQuery = question
  const handleQuestion = async (e) => {
    e.preventDefault()
    try {
      if(!question){
        alert("Please enter a question")
      }
      const response = await axios.get(
        "http://localhost:8080/api/invictus/rusted/summarizer/query",
        { videoUrl, userQuery }
      )
      const resAnswer = response.data.answer.text
      setAnswer(resAnswer);
      console.log(resAnswer)
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const resSummary = summary.summary
  const vidSummary = resSummary
  .substring(0, resSummary.indexOf("Keywords:"))
  .split("");
  const keywords = resSummary.includes("Keywords:") && resSummary.split("Keywords:")[1]
  return (
    <div className="main">
      <div className="summary">
        <h2 style={{display:"flex", justifyContent:"center",marginTop:"1rem"}}>Summary</h2><hr />
        <div style={{ background: "transparent" }}>
          {vidSummary.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                delay: i / 100,
              }}
              key={i}
            >
              {el}
            </motion.span>
          ))}
        </div>
        <div>Keywords: {keywords}</div>
      </div>
      <div className="qNa">
        <h2>Ask a Question</h2>
        <input className="question" type="text" placeholder="Enter your question here" value={question} onChange={(e) => setQuestion(e.target.value)}/>
        <button className="answer-btn" onClick={handleQuestion}>Answer</button>
        <div className="answer">

        </div>
      </div>
    </div>
  );
};

export default Main;

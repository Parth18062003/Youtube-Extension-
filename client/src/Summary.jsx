import axios from 'axios'
import React, { useState } from 'react'

const Summary = () => {
  const [summary, setSummary] = useState("")
  const viewSummary = async () => {
    try {
        const summary = await axios.post("http://localhost:8080/api/invictus/rusted/summarizer/summary")
        setSummary(summary.summary)
    } catch (error) {
        console.log(error)
    }
}
  return ( 
    <>
    <button onClick={viewSummary}>View</button>
    <div><h1>Summary</h1>{summary.summary}</div></>
  )
}


export default Summary; 


import { loadSummarizationChain } from "langchain/chains";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAI } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY
    batchSize: 512, // Default value if omitted is 512. Max is 2048
  });

export async function summarizeVideo(videoUrl) {

    const loader = YoutubeLoader.createFromUrl(videoUrl, {
        language: "en",
        addVideoInfo: true,
    });
    
    const docs = await loader.load();
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });
    
    const docsSummary = await splitter.splitDocuments(docs);
    
    const createDBFromYoutube = await FaissStore.fromDocuments(
        docsSummary,
        embeddings
    );

    const llmSummary = new OpenAI({
        temperature: 0,
        openAIApiKey:"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",
      }); 

    
    const summaryTemplate = `
      You are an expert in summarizing YouTube videos.
      Your goal is to create a summary of a youtube video and extract atmost 5-10 useful keywords that are nouns or adjectives.
      Below you find the transcript of the video:
      --------
      {text}
      --------
      
      The transcript of the video will also be used as the basis for a question and answer bot.
      
      Total output will be a summary of the video and the keywords.
      
      SUMMARY AND KEYWORDS:
      `;  
      
    const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);
    
    const summaryRefineTemplate = `
    You are an expert in summarizing YouTube videos.
    Your goal is to create a summary of a video.
    We have provided an existing summary up to a certain point: {existing_answer}
    
    Below you find the transcript of the video:
    --------
    {text}
    --------
    
    Given the new context, refine the summary.
    The transcript of the video will also be used as the basis for a question and answer bot.
    If the context isn't useful, return the original summary.
    Total output will be a summary of the video and the keywords.
    
    SUMMARY AND KEYWORDS:
    `;
    
    const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
        summaryRefineTemplate
    );
    
    const summarizeChain = loadSummarizationChain(llmSummary, {
    type: "refine",
    verbose: true,
    questionPrompt: SUMMARY_PROMPT,
    refinePrompt: SUMMARY_REFINE_PROMPT,
   });


   const summary = await summarizeChain.run(docsSummary);
   return {summary};
}

/*
  Here is a summary of the key points from the example video transcript:
  
  -The React video provides a comprehensive walkthrough of essential React concepts, including the usage of useEffect and components in building dynamic web applications.
  
  -The tutorial explains how useEffect is employed to manage side effects in React, such as data fetching, subscriptions, or manually changing the DOM. It highlights the importance of using useEffect to handle tasks that require cleanup or synchronization with the React lifecycle.
  
  -The video delves into the significance of components in React development, emphasizing their modular and reusable nature. It showcases how components enhance code organization, maintainability, and facilitate the creation of complex user interfaces.
  
  -Additionally, the tutorial demonstrates practical examples of React components, illustrating their role in creating interactive and dynamic UI elements. It covers the process of passing data between components and explores the concept of props and state.
  
  -The React video concludes by emphasizing the versatility and efficiency of React for building modern web applications, showcasing its popularity in the developer community.
  
  Here are the keywords from the example video transcript:
  React, useEffect, components, props, state, web applications, React components, React development, React video, React lifecycle.
*/

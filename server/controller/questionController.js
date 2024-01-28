import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function answerQuery(videoUrl, userQuery) {
const promptTemplate = `You are an expert in summarizing YouTube videos and answering questions about them.Your goal is to use the following transcript to answer the question below. If you do not know then write "Not enough information to answer the question". Do not make information up.

{context}

Question: {question}`;
const prompt = PromptTemplate.fromTemplate(promptTemplate);

// Initialize the LLM to use to answer the question.
const model = new OpenAI({
    temperature: 0,
    openAIApiKey:"",
});
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

// Create a vector store from the documents.
const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({
    openAIApiKey: "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",
    batchSize: 512,
}));

// Create a chain that uses a stuff chain and HNSWLib vector store.
const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(model, { prompt }),
  retriever: vectorStore.asRetriever()
});
const answer = await chain.call({
  query: userQuery,
});

return answer;
}

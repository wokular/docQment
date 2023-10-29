import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

const llm = new OpenAI({
    temperature: 0.9,
});

const chatModel = new ChatOpenAI();

const text = "TEMP PROMPT HERE";

const llmResult = await llm.predict(text);

const chatModelResult = await chatModel.predict(text);


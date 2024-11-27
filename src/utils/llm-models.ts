import type { llm_modelsT } from "../store/context";

import nidumShared from '../assets/imgs/Nidum-Shared.png';
import anthropic from '../assets/imgs/anthropic.png';
import sambanova from '../assets/imgs/sambanova.png';
import ollama from '../assets/imgs/ollama.png';
import openai from '../assets/imgs/openai.png';
import local from '../assets/imgs/local.png';
import logo from '../assets/imgs/logo.png';
import groq from '../assets/imgs/groq.png';
import hf from '../assets/imgs/hugging-face.png';

type listT = {
  id: string
  title: llm_modelsT
  logo: any
  para: string
}

const llmModels: listT[] = [
  {
    id: "1",
    logo: logo,
    title: "Nidum Decentralized",
    para: "Nidum's Decentralized Heterogenous AI Network"
  },
  {
    id: "2",
    logo: local,
    title: "Local",
    para: "Run AI models locally on your machine"
  },
  {
    id: "3",
    logo: nidumShared,
    title: "Nidum Shared",
    para: "Use AI models that someone is sharing through Nidum"
  },
  {
    id: "4",
    logo: groq,
    title: "Groq",
    para: "Run inference on Groq LPUs"
  },
  {
    id: "5",
    logo: ollama,
    title: "Ollama",
    para: "Run AI models locally on your machine"
  },
  {
    id: "6",
    logo: hf,
    title: "Hugging Face",
    para: "Inference API from Hugging Face (Serverless)"
  },
  {
    id: "7",
    logo: sambanova,
    title: "SambaNova Systems",
    para: "Inference API from SambaNova Systems"
  },
  {
    id: "8",
    logo: openai,
    title: "OpenAI",
    para: "Big Daddy of AI - ChatGPT"
  },
  {
    id: "9",
    logo: anthropic,
    title: "Anthropic",
    para: "The prodigal contender - Claude"
  },
]

export default llmModels
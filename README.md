# AI Resume Copilot ⚡

A high-performance, responsive full-stack AI-driven application that builds an intelligent **Resume Tailoring and Dual-Pipeline Job Application Engine**. The application leverages Retrieval-Augmented Generation (RAG) paradigms alongside an advanced recovery parsing engine to map technical profile assets onto targeted corporate requirements with sub-50ms caching latency.

## 🚀 Key Engineering Features

- **Full-Stack Architecture:** Built using an Express.js backend API gateway matched smoothly to a declarative, component-driven React browser interface.
- **Geographic Search Targeting Engine:** Filters and dynamically generates deep-links across major professional networks (**LinkedIn, Internshala, Wellfound, and Indeed**) based on user country and city metrics.
- **Bulk Extraction Pipeline Hub:** Synthesizes multi-portal metadata queries instantly into a downloadable Excel-compatible `.csv` tracking document mapping out **100+ precision application search data records**.
- **High-Resiliency Heuristics:** Features string-based cleanups and a multi-stage failover architecture to gracefully handle large LLM token truncation limits without payload compilation runtime drops.
- **Low-Latency Optimization:** Designed defensively utilizing custom request validation middleware coupled with a high-durability in-memory caching model.

## 🛠️ System Stack

- **Frontend:** Declarative React UI, Tailwind CSS, Async Fetch Engine API (AbortController Signals)
- **Backend Node Layer:** Express.js, CORS Management Protocols, Crypto Hashing utilities, Dotenv Isolation
- **AI Core:** RAG Semantic Parsing Strategy, OpenRouter API Multi-Model Failover Clustering

## 🔧 Installation & Initialization Guide

### 1. Backend Gateway Configuration
Ensure you have an active `.env` asset structured inside your `/backend` folder:
```text
PORT=5000
OPENROUTER_API_KEY=your_secret_production_key_here
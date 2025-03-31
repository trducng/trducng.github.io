---
layout: post
title: "On the necessity of chunking"
date: 2025-03-30 23:26:35 +0000
tags: ai-application
---
The current dominant assumption on the necessity of chunking is because of limited LLM context length. In 2023, 2024 when the model can only hold several thousand context length. When LLM supports longer context, the chunking step is still important, because there will be document or any block of information, longer than what the LLM can support. It can be generalized that, because LLM doesn't have unlimited context length, there will always be some chunking step somewhere.

As a result, the RAG pipeline usually starts with parsing the file into a long string, then chunks that string into smaller segments, then indexes those segments. This approach has some problems.

If we chunk so that each segment can at most be of LLM context length. Even done correctly, this will be useless, because in the generation step, we will have to account for user queries, system prompt, and the combined length can be still over the LLM context length. Plus, if we retrieve topk in the retrieval steps, then we don't have enough context length to host the topk segments.


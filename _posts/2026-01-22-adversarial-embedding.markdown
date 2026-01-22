---
layout: post
title: "How robust are LLM embeddings to adversarial perturbations?"
date: 2026-01-22 04:11:59 +0000
tags: interpretability
---

In computer vision, adversarial examples are well-studied. They are small, carefully crafted perturbations to images can fool classifiers. But what about large language models? The discrete nature of text makes direct adversarial attacks harder, but we can still ask: **how robust are the internal embeddings of LLMs to perturbations?**

I ran some experiments on Qwen3-4B to find out
([Code](https://github.com/trducng/dawnet/blob/master/experiments/adversarial_embedding.ipynb)).

## Setup

I used a simple indirect object identification task:

> "When John and Mary went to the shop, John gave the bag to ___"

The model correctly predicts **" Mary"**. The goal: perturb the token embeddings to change this prediction.

![Experiment Setup](/assets/imgs/adversarial_setup.svg)

## Experiment 1: Perturbing Only the Last Token

### Flipping to a Specific Target (" John")

Using gradient descent to modify only the last token's embedding (" to"), I tried to flip the prediction from " Mary" to " John".

**Result:** It took **88 iterations** to succeed. The cosine similarity between the original and modified embedding dropped from 1.0 to ~0.35—a massive change.

| Iteration | Top Predictions | Cosine Similarity |
|-----------|-----------------|-------------------|
| 0         | Mary, the, a    | 1.00              |
| 10        | Mary, the, a    | 0.99              |
| 33        | the, 了, 的     | 0.85              |
| 88        | John, the, a    | 0.35              |

### Making the Prediction Wrong (Any Wrong Answer)

Instead of targeting " John", I simply tried to knock " Mary" off the top.

**Result:** Only **4 iterations** needed. The model quickly shifted to predicting "the" instead.

**Takeaway:** It's much easier to break the correct answer than to steer toward a specific alternative.

## Experiment 2: Random Jittering

What if we just add random noise to the embeddings of the last token (" to"), instead of using gradients?

**Result:** The model is remarkably robust. Even with 100-200% random jittering (multiplying each embedding dimension by a random factor), " Mary" often remained the top prediction.

**Why?** My hypothesis: during training, self-attention layers naturally introduce noise-like variations to embeddings. This may act as implicit regularization, making the model robust to random perturbations but still vulnerable to adversarial (gradient-based) ones.

## Experiment 3: Perturbing All Token Embeddings

### Flipping to " John" (All Tokens)

When allowed to modify all token embeddings:

**Result:** Only **1 iteration** needed. The gradient significantly updated the " John" token embedding. Maybe this caused the flip to happen easily.

### Suppressing the Target Token

What if we block updates to the " John" embedding?

**Result:** **7 iterations** needed. The model had to modify many other tokens instead:
- "Mary" embedding (to suppress it)
- "When", "gave", "and" (context tokens)
- Interestingly, tokens not in the sentence (Alice, James, Sarah) also received small gradients update

## Key Findings

- **Asymmetric robustness**: Breaking the correct answer is easy; steering to a specific target is hard.
- **Random noise ≠ adversarial**: Models are robust to random perturbations but vulnerable to gradient-based attacks.
- **Embedding changes required are large**: Flipping predictions via the last token alone requires reducing cosine similarity to ~0.35.
- **Gradient leaks to related tokens**: Even tokens not in the input receive gradients—names like "Alice", "James", "Sarah" got small updates when attacking "Mary".

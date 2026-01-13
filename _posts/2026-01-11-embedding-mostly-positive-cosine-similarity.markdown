---
layout: post
title: "The token embeddings in LLM mostly have positive cosine similarity with each other"
date: 2026-01-11 12:15:42 +0000
---

One thing I notice is that the cosine similarity of hidden representation across
tokens is usually positive. Very rarely I can find a pair that has negative
cosine similarity. This is interesting, since I intuitively expect words with
opposite meanings (such as "hot" and "cold") will have negative similarity, and
the vast majority of unrelated words will have cosine similarity around 0. Maybe the cosine
similarities are already mostly positive right from the beginning at the
embedding layer. And since each subsequent layer just "minimally" transforms
from that representation, the cosine similarity of the hidden representations
between tokens mostly stay positive.

I randomly select a token, then measure the cosine similarity of the embedding of
that token with that of the remaining tokens. Doing so for 50 tokens and averaging
the results:


| Model | Min | Max | Mean | Median | Non-negative pairs | Negative pairs | Percentage of positive entries |
|-------|-----|-----|------|-------|-------|----------|-------------------------------|
| Qwen3-4B-Thinking-2507 | -0.22 | 0.58 | 0.1 | 0.08 | 149971.76 | 1963.24 | 0.9871 |
| Qwen3-0.6B | -0.23 | 0.61 | 0.12 | 0.12 | 149639.54 | 2295.46 | 0.9849 |
| gemma-3-4b-it | -0.09 | 0.56 | 0.03 | 0.03 | 239564.38 | 22642.62 | 0.9136 |
| Olmo-3-7B-Think | -0.05 | 0.47 | 0.03 | 0.02 | 89748.3 | 10528.7 | 0.895 |
| gpt-oss-20b | -0.28 | 0.69 | 0.09 | 0.09 | 169767.52 | 31319.48 | 0.8442 |
| openai/gpt-oss-120b | -0.3 | 0.68 | 0.05 | 0.05 | 143427.84 | 57659.16 | 0.7133 |
| gemma-3-27b-it | -0.07 | 0.55 | 0.01 | 0.01 | 177327.0 | 84880.0 | 0.6763 |
| Qwen3-30B-A3B-Base | -0.1 | 0.41 | 0.01 | 0.01 | 94062.54 | 57872.46 | 0.6191 |

Generally, the smaller the model, the higher the proportion of non-negative pairs
compared to negative pairs. Nevertheless, the cosine similarity never goes into
the negative side as much as into the positive side.

Running this test with a randomly initialized embedding layer yields an expected
~50% token pairs with positive cosine similarity.

Looking at a randomly selected token ID from the Qwen model vocabulary, when
examining which tokens have negative cosine similarity with that token, I see
(truncated):

```
tensor([  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,
         14,  15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25,  26,  27,
         28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,  39,  40,  41,
         42,  43,  45,  46,  47,  49,  50,  51,  53,  54,  55,  56,  58,  59,
         60,  61,  62,  64,  65,  66,  67,  68,  69,  71,  72,  73,  74,  75,
         77,  78,  79,  81,  82,  83,  86,  87,  88,  90,  91,  92, 120, 149,
        151, 170, 197, 198, 201, 220, 222, 230, 231, 233, 234, 245, 253, 254,
        256, 257, ...], device='mps:0')
```

Very interestingly, the consecutive tokens in the range 0 to 92 have negative
cosine similarity with the random token. In fact, I see this pattern in almost
all other random tokens as well. These consecutive tokens correspond to ASCII
characters, special symbols, and control characters:
`!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLNOPRSTVWXY[\\]^_abcdefhijklnoprstwxy{|}����\t\n\r
���`. Maybe they serve some important functions to construct meaning, different
from other tokens.

You can follow the code or test other model in this notebook: https://github.com/trducng/dawnet/blob/master/experiments/vis_embedding_02.ipynb

This finding has interesting implications for how LLMs represent meaning. The
predominantly positive cosine similarities suggest that token embeddings exist
in a region of the embedding space where they generally "agree" with each other,
rather than being uniformly distributed. This bias likely emerges during
pretraining and may reflect how these models organize semantic information—with
special tokens and punctuation serving as distinct anchoring points that help
construct meaning differently from content words.

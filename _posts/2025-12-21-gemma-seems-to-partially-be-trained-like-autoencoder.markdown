---
layout: post
title: "The Gemma model family seems to partially be trained like autoencoder"
date: 2025-11-21 09:43:35 +0000
tags: interpretability
---

(This is the [notebook](https://github.com/trducng/dawnet/blob/master/experiments/gemma-autoencoder.ipynb) to test the idea).

Feeding a single token (without the BOS token) through the Gemma models will likely return the input token. This behavior doesn't show up in other model families like Qwen or gpt-oss.

Compare with:


| Word       | gemma-7b   | gemma2-2b  | gemma3-27b | gpt-oss-120b | qwen3-4b    |
| -----      | --------   | ---        | -          | -            | -           |
| ' John'    | ' John'    | ' John'    | ' John'    | ' Doe'       | 'a'         |
| ' Michael' | ' Michael' | ' Michael' | ' Michael' | ''s'         | 'a'         |
| ' Mary'    | ' Mary'    | ' Mary'    | ' Mary'    | ','          | 'a'         |
| ' France'  | ' France'  | ' France'  | ' France'  | '.'          | ','         |
| ' Italy'   | ' Italy'   | ' Italy'   | ' Italy'   | ','          | ':'         |
| ' Rome'    | ' Rome'    | ' Rome'    | ' Rome'    | ','          | ','         |
| ' red'     | ' red'     | ' red'     | ' red'     | 'irection'   | ' triangle' |
| ' green'   | ' green'   | ' \n'      | ' green'   | ','          | '"'         |
| ' January' | ' January' | ' January' | ' January' | ' '          | ','         |
| ' March'   | ' March'   | ' March'   | ' March'   | ' '          | 'a'         |
| ' happy'   | ' happy'   | ' happy'   | ' happy'   | ' to'        | ' which'    |
| ' sad'     | ' saddest' | ' sad'     | ' sad'     | '.'          | '"'         |
| ' angry'   | ' angry'   | ' angry'   | ' angry'   | '.'          | ','         |
| ' run'     | ' run'     | ' run'     | ' run'     | ' the'       | ' show'     |
| ' jump'    | ' jump'    | ' jump'    | ' hurdle'  | ' to'        | ' show'     |
| ' walk'    | ' walk'    | ' walk'    | ' walk'    | ' through'   | 'a'         |
| ' teacher' | ' teacher' | ' teacher' | ' teacher' | ''s'         | ','         |
| ' doctor'  | ' doctor'  | ' doctor'  | ' doctor'  | ','          | 'a'         |

When testing the completion on a longer sequence `"When John and Mary went to the store, John gave the bag to"`:

- gemma-7b: 'writeHead'
- gemma2-2b: ' the'
- gemma3-27b: ' the'
- gpt-oss-120b: ' Mary'
- qwen3-4b: ' Mary'

Prepend the input with the BOS token makes the Gemma models predict the next token similarly to other model families. The BOS token then acts as a special token to instruct the model to complete the sequence.

It seems Google excludes the BOS and matches the input - ouput tokens to improve the internal representation of the model. Given the Gemma model family is surprisingly good for its size, maybe this is one of the approaches contribute to its capability.


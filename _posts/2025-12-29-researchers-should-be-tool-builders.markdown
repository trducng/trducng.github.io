---
layout: post
title: "Researchers should be tool builders"
date: 2025-12-29 19:25:25 +0000
---

No one is in a better position to build tools for researchers than researchers.

In one of my previous companies, we had an internal data management tool that
supports annotating, managing, and serving data for the AI researchers. The tool
is slow and it takes forever to add new functions. The developer hates it when
users ask for features, thinking it goes beyond the original scope, while the
users don't understand why it is so hard to accommodate what they think are basic
requests.

I was one of those users. The tool made me so frustrated that I went over its
technical design to understand why it was so hard to add new features. It was
clear from the design document that it was indeed hard to support new features.
I was curious on why they made such design decision, and looked into all the
requirements and planning papers. I remember I had to laugh, because,
though the design was stupid, it did indeed satisfy everything in the
requirements! The requirements were not necessarily wrong either. They just
emphasize the priority of use cases slightly differently, while still in spirit
accurately describes what the users generally want. I guess there are just
multiple answers for the same software design, and choosing one from another
requires being in the shoes of the users, imagining the growth of the user and
of the research direction, to make a good bet on the correct design.

This is one of the reasons I think coding agents will not be able to build
software in isolation and will require humans to direct them in building software.
Despite the remarkable ability to write code, coding agents don't have the full
knowledge about the software use case as humans do. Humans are almost always
users of a software. Besides the articulated requirements, they have innumerable
hopes and expectations that they can't put into words, not only because
otherwise the requirements become unfathomably long, but also because a lot of
the hopes and expectations are so vague that words can't describe them.

This is even truer for research tools. The search space and uncertainty in
research is larger than that of any established disciplines. Non-researchers
building research tools will find it difficult to design in anticipation of myriad
unknown unknowns. They have to build the tool correctly for the current research
ideas, but should still be easily extensible enough for future research directions.

In my previous company, in the end, I partnered with the same developers to
build a new data management tool, completely changing the data structure, module
interfaces. I was very proud of it. Users of my tool said that they have never
used a better data management tool, even from any 3rd-party vendor, even in
their next jobs. However, it took quite a lot of effort to build the tool. Now,
with the help of coding agents, the difficulty should be lower. Yet I still believe
there should be researchers taking the driver's seat in building the tools.


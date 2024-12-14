---
title: CHAPTER 1 Welcome to Grokking Simplicity
date: 2023-03-04 00:17:47 +0900
tags: ["FP"]
description: Markdown summary with different options
---


Functional programming is a programming paradigm that minimizes *side effects* using *mathematical
functions*.

- mathematical function: also called *pure function*, which always returns the same results only if
  the same input values are given.
- side-effect: changes in global states. Side effects can incur unexpected outcomes in your code. It
  is therefore very important to manage all ‘actions’ that are in your code. To minimize these
  risks, the functional programming paradigm commands you to get rid of as many side effects as you
  can.

In functional programming, codes can be one of these three categories.

1. Action: A code that returns different values depending on when or how many times it has been
   executed.
2. Calculation: A code that returns the same result, given the same input.
3. Data: A code that is always the same value even without execution.

Calculations over actions and data over calculations. This dogma aligns with distributed systems,
which are increasingly becoming popular these days. Converting action codes into calculation codes
would also make it easier to manipulate the code base.

You should learn about *first-class abstractions* while practicing sorting codes in the three
categories above.

First-class abstraction is to handle functions like values.

- Passing the function as a parameter to another function
- Returning a function within a function
- Assign the function to a variable
- Involve the function in a data structure

In the following posts, we’ll talk about some prerequisites ahead of our functional journey.
Luckily, the stories about how functional programming can be used in the real world are just around
the corner! They would help you to take advantage of functional programming on your working code
base.

Stay tuned!
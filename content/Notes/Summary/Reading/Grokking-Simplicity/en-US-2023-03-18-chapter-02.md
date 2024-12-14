---
title: CHAPTER 2 Functional thinking in action
date: 2023-03-18 20:03:00 +0900
tags: ["FP"]
description: Markdown summary with different options
---

In Chapter 2, we’ll learn how to apply functional thinking in the real world through Toni’s Pizzeria.

Toni runs a pizza shop in the year 2118 where everything is made of software. As the shop is breaking sales record day after day, the owner of the Pizzeria is planning to expand her business. She knows that functional programming principles can reduce the cost of code changes. Therefore, the first step she takes is categorizing the Pizzeria code into Action, Calculation, and Data.

- Action: stretching the dough, delivering pizza, ordering materials, etc.
- Calculation:  changing the recipe according to demand, making a grocery shopping list, etc.
- Data: pizza recipe, customer order, receipt, etc.

Then, as you can see below, she makes three layers for the code based on their rate of change. In other words, following ***stratified design***, Toni divided the code base into *Business rules*, *Domain rules*, and *Tech stack*.

![Organizing code by “rate of change”](https://drek4537l1klr.cloudfront.net/normand/Figures/f0020-01.jpg){: width="500"}

Until now, a robot single-handedly carried the entire workload of the Pizzeria. By buying two more robots, Toni expects to speed up the pizza-making process. Here is the sequence of how to make a pizza.

![As applied to a robotic kitchen](https://drek4537l1klr.cloudfront.net/normand/Figures/f0021-01.jpg){: width="500"}

Assume the three robots would do the tasks described in the ***timeline diagram*** above. Then, the part of preparing the materials can be distributed to each robot.

![Timelines visualize distributed systems](https://drek4537l1klr.cloudfront.net/normand/Figures/f0022-01.jpg){: width="500"}
Now, it’s time to dispatch our *pizza squad*! By the way, did we tell them to work together? What if robot B took the dough away in the middle of robot A making it? The dough must be incomplete, and eventually, the customer will receive a ruined pizza. Oh no, that shouldn’t happen!

***Timeline cutting*** is the solution for this kind of situation. Mark the line above the task `Roll out dough`, which demands all the ingredients for the pizza to be fully prepared beforehand. The line on the timeline diagram must be drawn like this.
![Cutting the timeline](https://drek4537l1klr.cloudfront.net/normand/Figures/f0025-02.jpg){: width="500"}

Timeline cutting gives the entire picture of the best model for co-workers and the prerequisites of each task.

The following chapters will explain the details of the terminologies used above.


- ***Stratified design***: chapter 8, 9
- ***Timeline diagram***: chapter 15
- ***Timeline cutting***: chapter 16


You can find the original post [here](https://livebook.manning.com/book/grokking-simplicity/chapter-2/).
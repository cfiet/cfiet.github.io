---
layout: single-post
title: "And yet it moves - introduction"
isPost: true
date: "2014-03-10 20:00"
tags: "js HTML5 WebGL performance games emscripten tutorial"
hidden: true
---

Experiment with JS performance while watching some celetsial bodies
----

This is something I had going in my mind for quite a while now, so it is high time to start this.

![This post was brought to you by Gallileo Gallilei](/img/posts/2014/Galileo_Galilei.jpg)

This week I will be implementing simple universe simulation in JavaScript that implements
[Newtonian gravity](http://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation) (since
[General gravity](http://en.wikipedia.org/wiki/General_relativity) is out of my reach). While
doing so, I will experiment to demonstrate the performance implications of some design decisions
and how using some of the HTML5 APIs can (hopefully) drastically improve the performance. Last
but not least, I will show you some WebGL and [Three.js](http://mrdoob.github.io/three.js/) 
capabilities, because what use is the universe if you can`t see it.


The plan is:
1. Implement naive solution to present basic simulation concepts and brag about WebGL
2. Iterate the solution to present how some design decisions and data layout can affect performance
3. See if moving heavy lifting to Web Workers can improve performance
4. Try to implement simillar simulation in C and OpenGL, compile with Emscripten, compare performance
5. Have [fun, fun, fun, fun!](https://www.youtube.com/watch?feature=player_detailpage&v=kfVsfOSbJY0#t=120)


So stay tuned and drop at the end of the week to see how much have I done.

---
layout: single-post
title: "Bringing back the eighties with Emscripten - introduction"
isPost: true
date: "2014-01-21 20:00"
tags: "js HTML5 games emscripten tutorial"
---

Since I first stumbled on some [Emscripten](https://github.com/kripken/emscripten/wiki) demos, I
had this idea of trying it out by bringing back my favorite childhood games to the web. Last week,
I finally got some time to get to it. This post starts the series that
descibe my attempts to port a game written in C to HTML5.


All aboard the nostalgia train!
-----

![Behold the Atari ST power in all it`s might!](/img/posts/2014/gnurobbo0-screenshot.png)

For those who weren`t in Poland in 1980s, the above screenshot comes from one of the first
Polish games developed for [Atari](http://en.wikipedia.org/wiki/Atari_8-bit_family). This game
introduced me to computers and dragged-in my whole family, including my mother, which was
a feat no other game has archived ever since. So when I found [this Open Source port of Robbo](http://gnurobbo.sourceforge.net)
it seemed natural candidate for bringing back all the 1980s gaming fun to the modern Web.

<!-- Read more -->

A tool for the job
-----
So what exactly is [Emscripten](https://github.com/kripken/emscripten/wiki)? According to the project Wiki page
> Emscripten is an LLVM to JavaScript compiler. It takes LLVM bytecode (which can be generated from C/C++
> using Clang, or any other language that can be converted into LLVM bytecode) and compiles that into
> JavaScript,which can be run on the web (or anywhere else JavaScript can run).

To give some more explanation, [LLVM](http://llvm.org/) is a bytecode/abstract virtual machine format, 
simillar to [Java Virtual Machine](http://en.wikipedia.org/wiki/Java_virtual_machine) or
[Common Language Runtime](http://en.wikipedia.org/wiki/Common_Language_Runtime). The idea behind it is,
that program code is compiled to the platform-agnostic LLVM bytecode. This intermediate code can then be
either compiled again to target platform native code or run directly on target machine to be compiled on the fly,
allowing to maximize optimizations that are avaliable on target platform. Due to its modular architecture, 
it can be easily extended with both new languages that can be compiled to LLVM bytecode as well as new
target platforms that the bytcode can be run on or compiled to.

So where is Emscripten here? It is just the extension to LLVM, that alows to compile any LLVM bytecode
to *HTML5 Browser* target platform.

After this boring, technical introduction, let me show you few nice demos of what can be archived
with it. Keep in mind, that since some of these use WebGL you`ll need a fairly up-to-date browsers and
latest display drivers installed to run them:
 - [Epic Citadel](http://www.unrealengine.com/html5/) - full port of [Unreal Engine](http://www.unrealengine.com/)
 - [Project Banana Bread](https://developer.mozilla.org/en-US/demos/detail/bananabread) - a 3D, first person shooter
 that includes bot-enemies and multiplayer mode directly from browser.
 - [Vim.js](http://coolwanglu.github.io/vim.js/web/vim.html) - the power of VIM unleashed in your browser

If you want to see more, visit [Emscrpiten Demos](https://github.com/kripken/emscripten/wiki#wiki-demos) section
to see how many games and utility programs has already been proted to run inside your browser.

Stay tuned for the next post where I will be going throug how to set up Emscripten and the problems I stumbled on
in the process.

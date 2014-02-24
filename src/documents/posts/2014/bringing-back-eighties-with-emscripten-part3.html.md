---
layout: single-post
title: "Bringing back the eighties with Emscripten - let the fun begin"
isPost: true
date: "2014-01-22 20:00"
tags: "js HTML5 games emscripten tutorial"
---

Ok, so I started up with getting the source of `gnurobbo 0.66` and unpacking it in
local directory. I decided to build the native version first, so I can have a reference
to which I could compare the browser version later. After installing [SDL](http://www.libsdl.org/)
with `apt-get` everything went pretty smoothly.

![Main menu](/img/posts/2014/c-gnurobbo-menu.png) ![After starting the first level](/img/posts/2014/c-gnurobbo-level1.png)

Let`s get down to bussiness
-----
Ok, so following [Emscripten Wiki Page](https://github.com/kripken/emscripten/wiki/Building-Projects) I run the `emmake` command.

```bash
cfiet@crunchbang:~/projects/gnurobbo$ emmake make -f Makefile.emscripten 
/home/cfiet/projects/emscripten/emcc  -Wall `sdl-config --cflags` -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\" -DUSE_PIXMAP_FONT -DHAVE_MUSIC -DHAVE_DESIGNER -c board.c -o board.o
controls.c:841:12: error: use of undeclared identifier 'stdout'
                fprintf (stdout, "Error setting key repeat: %s\n", SDL_GetError ());
                         ^
controls.c:891:23: error: use of undeclared identifier 'stdout'
                        if (show) fprintf (stdout, "Joystick closed: %i:%s\n",
                                           ^
controls.c:907:25: error: use of undeclared identifier 'stdout'
                                        if (show) fprintf (stdout, "Joystick opened: %i:%s\n",
                                                           ^
controls.c:915:24: error: use of undeclared identifier 'stdout'
                                if (show) fprintf (stdout, "Couldn't open joystick %i:%s!\n",
                                                   ^
controls.c:921:24: error: use of undeclared identifier 'stdout'
                                if (show) fprintf (stdout, "Couldn't open any of %i joystick(s)!\n",
                                                   ^
controls.c:931:24: error: use of undeclared identifier 'stdout'
                                if (show) fprintf (stdout, "Joystick opened: %i:%s\n",
                                                   ^
controls.c:936:24: error: use of undeclared identifier 'stdout'
                                if (show) fprintf (stdout, "Couldn't open joystick %i\n", joyid);
                                                   ^
controls.c:950:26: error: use of undeclared identifier 'stdout'
                                                if (show) fprintf (stdout, "Joystick opened: %i:%s\n",
                                                                   ^
controls.c:967:27: error: use of undeclared identifier 'stdout'
                                                        if (show) fprintf (stdout, "Joystick opened: %i:%s\n",
                                                                           ^
controls.c:977:25: error: use of undeclared identifier 'stdout'
                                        if (show) fprintf (stdout, "Couldn't find joystick %i:%s\n",
                                                           ^
controls.c:986:22: error: use of undeclared identifier 'stdout'
                if (show) fprintf (stdout, "There is no joystick to initialise\n");
                                   ^
controls.c:1052:23: error: use of undeclared identifier 'stdout'
                        if (show) fprintf (stdout, "Joystick found: %i:%s\n",
                                           ^
controls.c:1058:22: error: use of undeclared identifier 'stdout'
                if (show) fprintf (stdout, "No joystick found\n");
                                   ^
controls.c:1513:9: error: duplicate case value 'SDLK_2'
                        case SDLK_EURO:
                             ^
controls.c:1483:9: error: duplicate case value 'SDLK_LGUI'
                        case SDLK_LSUPER:
                             ^
controls.c:1486:9: error: duplicate case value 'SDLK_RGUI'
                        case SDLK_RSUPER:
                             ^
4 warnings and 16 errors generated.
ERROR    root: compiler frontend failed to generate LLVM bitcode, halting
make: *** [controls.o] Błąd 1
```

Bam, errors, errors, errors. But after some closer investigation, there are two main reasons for them:
 1. Missing `stdout` identifier. This is  easily-fixable by
    [adding appropriate header file](https://github.com/cfiet/gnurobbo/commit/327b6cb0d5147309b5a169f48d23722f14ad38df#diff-1),
 1. Duplicate case values coming from `SDL_*`. After some investigation it turned out that
    Emscripten uses its own, custom SDL version where only part of the library is currently
    supported. A lot of `SDL_*` defines are actually expanded to the same symbol when compiling.
    There is probably no good solution to this issue, so for now I decided to [remove this sections
    of code](https://github.com/cfiet/gnurobbo/commit/746e8b26fdbaa17be05fc262bf60d1ba6fb12802#diff-3)
    with conditional compilation.

Retried the compilation and, success!

```bash
cfiet@crunchbang:~/projects/gnurobbo$ emmake make -f Makefile.emscripten 
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c board.c -o board.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c controls.c -o controls.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c font.c -o font.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c game.c -o game.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c konstruktor.c -o konstruktor.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c levels.c -o levels.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c locales.c -o locales.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c pointer_controls.c -o pointer_controls.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c rcfile.c -o rcfile.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c ROB_engine.c -o ROB_engine.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c screen.c -o screen.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c skins.c -o skins.o
/home/cfiet/projects/emscripten/emcc  -Wall -DPLATFORM_PC -DVERSION=\"0.66\" -DPACKAGE_DATA_DIR=\"./data\"  -DHAVE_MUSIC -DHAVE_DESIGNER -c sound.c -o sound.o
/home/cfiet/projects/emscripten/emcc   board.o  controls.o  font.o  game.o  konstruktor.o  levels.o  locales.o  pointer_controls.o  rcfile.o  ROB_engine.o  screen.o  skins.o  sound.o  -o gnurobbo.bc

emcc -O2 gnurobbo.bc -o out/gnurobbo.html
INFO     root: =======================================
INFO     root: bootstrapping relooper...
INFO     root:   bootstrap phase 1
INFO     root:   bootstrap phase 2
INFO     root: bootstrapping relooper succeeded
INFO     root: =======================================
warning: unresolved symbol: TTF_Quit
warning: unresolved symbol: TTF_RenderUTF8_Shaded
warning: unresolved symbol: SDL_DisplayFormat
warning: Output contains some very large functions, consider using OUTLINING_LIMIT to break them up (see settings.js)
```

Got few warnings, got some errors, but other than that it worked.

![It compiled!](/img/posts/2014/excited-baby.gif)

Hold your horses!
-----
The feeling of success quickly faded after an attempt to open the page in the browser:

![Does not compute](/img/posts/2014/gnurobbo-page-v1.png)

The last message is
```
Cannot find the default level file: ./data/levels/original.dat
```

So... it tries to find some game data files but fails to do that. Thanfully, quick browse through the 
[Emscripten documentation](https://github.com/kripken/emscripten/wiki/Filesystem-Guide) reveals the 
way of pre-packaging data files with your application. 
[Adding the option to the compilation](https://github.com/cfiet/gnurobbo/commit/e195be22bd185a50a877cdb5bf3fb3d141a53fa5)
got rid of the previous error, again after refreshing the page nothing really happened.

No direct errors were in the Emscripten cosole, however in JavaScript developer console I found
```
"missing function: SDL_DisplayFormat" gnurobbo.html:709
uncaught exception: abort() at stackTrace@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:1454
abort@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10837
_SDL_DisplayFormat@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:9952
callMain@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10734
doRun@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10787
run/<@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10799
"-1"
```

So, `SDL_DisplayFormat` is not implemented in Emscripten flavour of SDL. For a moment I thought that
this is as far as I get - no function means no function.  I could try to implement missing functionality,
but as I\`m not an expert in SDL this would probably require a lot of effort. However, poking around
sources of Emscripten version of SDL, I found an implementation of function `SDL_DisplayFormatAlpha`.
Googling revealed that it works and that it most probably ignore the alpha channel for now, so I
decided to give it a try and [replaced all the occurences of `SDL_DisplayFormat`](https://github.com/cfiet/gnurobbo/commit/0cdcf6c76d0dda98fbc234784f063d145cd126e4).

After recompilation and page refresh I was welcomed with same white screen, but the JS console error has changed.
```
uncaught exception: Mix_QuerySpec: TODO
```

So, another unsupported function. This one however seemed to be connected to the sound subsystem, so I decided to
[just remove it](https://github.com/cfiet/gnurobbo/commit/ba2809dcf807075bc332f9391d64ba0b7073b28c), accepting lack of in-game sounds.

Compile, refresh and error again.
```
"missing function: TTF_RenderUTF8_Shaded" gnurobbo.html:709
"-1" gnurobbo.html:709
uncaught exception: abort() at stackTrace@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:1454
abort@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10831
_TTF_RenderUTF8_Shaded@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:9391
callMain@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10728
doRun@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10781
run/<@file:///home/cfiet/projects/gnurobbo/out/gnurobbo.js:10793
```

TTF seemes like something connected to in-game font rendering. After some poking around `Makefile`
it turned out that you can either use TTF fonts or pixmap fonts with SDL, so I just [switched the mode to
pixmap](https://github.com/cfiet/gnurobbo/commit/d95ca08d534fdbad6ccec8f292c3fa93671a1be2) to see what happens.

Success happens
-----
![Yeeeeeeeeeeeeeeeeah!](/img/posts/2014/gnurobbo-page-v2.png)

Finally, I saw some progress here. However, game has terminated before I was able to do anything
with the following error:

```
SDL_Delay called on the main thread! Potential infinite loop, quitting.
```

Some poking around `game.c` revealed that `SDL_Delay` is used there to just control the framerate of
the main game loop. So I decided to give it a try and just remove this call as well. Recompiled,
refreshed the page and... Firefox spiked the processor, hanged and died. So, the game does not
terminate anymore, however the JavaScript code gets into an infinite loop. Remembering that
I did have glanced on the main-loop issues somewhere in the Emscripten documentation, I did some
googoling and got the page on 
[Asynchronous main loop in browser](https://github.com/kripken/emscripten/wiki/Emscripten-browser-environment#wiki-implementing-an-asynchronous-main-loop-in-cc).

So, some refactoring had to be done, no biggie. Actually, the task turned out to be a little bit challenging due
to the way in which the main-loop is implemented in GNU Robbo, but after 10 minutes I was able to
[pull off the refactored version](https://github.com/cfiet/gnurobbo/commit/d4b98a46d27aabc8ce4bef44f8cead4c1841d138).

Recompile, refresh.

Huge success!
-----
![It works!](/img/posts/2014/success-dance.gif)

The game loads and works! It even plays sound correctly, despite the removed function. After fixing one last,
gameplay-breaking issue with random generator not working correctly, the game seems to be playable.

[Try it out for yourself](http://blog.cfiet.net/robbojs).

Have fun, and if you find any bugs feel free to report them on [github project page](https://github.com/cfiet/gnurobbo/issues).

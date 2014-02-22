---
layout: single-post
title: "Bringing back the eighties with Emscripten - setting things up"
isPost: true
date: "2014-01-21 22:00"
tags: "js HTML5 games emscripten tutorial"
---

Introduction
-----
Since a lot of work done with Emscripten and LLVM requires usage of command line and I
loathe the Windows command line, the steps in this post will describe the process of
setting up LLVM on Linux-based system. Specifically, I had some old virtual machine
with [Crunchbang Waldorf](http://crunchbang.org/) already installed, soI
used this one. Since this distribution is based on [Debian Wheezy](https://www.debian.org/releases/wheezy/), 
steps to set things up on Debian should be fairly simillar.

The main intention of this post is to show some LLVM and Enscripten problems I
stumbled on before I actually was able to compile anything.  Probably you can stumble
on them on any environment. I followed the instructions
from [this Emscripten Wiki section]( https://github.com/kripken/emscripten/wiki/Emscripten-SDK#wiki-installing-from-source)
so in case of any problems, you should take a look there in the first place.

If you already have all the things set up, you can skip this post and jump directly
to the next one.

Prerequisites
-----
The necessary prerequisites are:
 - Python
 - NodeJS
 - LLVM
 - clang
 - git

On Debian, all of them except NodeJS seemed to be already installed or avaliable in package
manager, so you can `apt-get install` them easily.

To obtain NodeJS through apt, you need to add `wheezy-backports` repository to the package
manager. In order to do that, edit `/etc/apt/sources.list` and add the following line there:

```
deb http://ftp.pl.debian.org/debian wheezy-backports main contrib non-free
```

**Warning:** Keep in mind that `wheezy-backports` repository contains the packages that are
less stable than default ones avaliable. Probably you don`t want to do this on improtant,
production machines.

Once you save the file, just run:
```bash
sudo apt-get update
sudo apt-get install llvm clang git nodejs
```

This should get you all the prerequisites.


Obtaining Emscripten
-----
Once the prerequisites are done installing, you can obtain the Emscripten toolchain by cloning the
git repository somewhere in your system. To do that, run the following commands:
```bash
git clone https://github.com/kripken/emscripten.git
cd emscripten
git checkout master
```

Emscripten is by default cloned with `incoming` branch which contains the developmen version
of the project. You need to manually check-out the `master` to get the more stable branch.

Once that is done, Emscripten is ready to be used on your machine.

It doesn`t work!
-----
Except, it did not work for me. I got the following error when compiled test file with emscripten C compiler:
```bash
cfiet@crunchbang:~/projects/emscripten$ ./em++ tests/hello_world.cpp
WARNING  root: (Emscripten: system change: 1.11.0|le32-unknown-nacl|/usr/bin|version vs 1.11.0|le32-unknown-nacl|/usr/lib/llvm-3.5/bin/|version, clearing cache)
WARNING  root: LLVM version appears incorrect (seeing "version", expected "3.2")
INFO     root: (Emscripten: Running sanity checks)
clang: error: no such file or directory: 'le32-unknown-nacl'
ERROR    root: compiler frontend failed to generate LLVM bitcode, halting
```

A quick check reveals the reason for this error
```bash
cfiet@crunchbang:~/projects/emscripten$ clang --version
Debian clang version 3.0-6.2 (tags/RELEASE_30/final) (based on LLVM 3.0)
Target: x86_64-pc-linux-gnu
Thread model: posix
```

So of course I have to install newer clang version - this is mentioned in documentation but
I didn\`t bother to check what was the default version obtained from repository. After some
googling, I found [this LLVM nightly packages](http://llvm.org/apt) repository for Debian.
To add it to your system, just create a file `/etc/apt/sources.list.d/llvm.list` with the 
following content:
```
deb http://llvm.org/apt/wheezy/ llvm-toolchain-wheezy main
```
**Warning:** This installs an unstable version of LLVM on your machine. Use with caution.

Then run the following commands:
```bash
sudo apt-get remove clang
sudo apt-get install clang-3.5
```

After installation has finished, I tried to compile the test file again:
```bash
cfiet@crunchbang:~/projects/emscripten$ ./em++ tests/hello_world.cpp
/usr/bin/llvm-nm: /tmp/tmpwBqfBx/hello_world_0.o: Unknown bitstream version!
/usr/bin/opt: /tmp/tmpwBqfBx/a.out.bc: Unknown bitstream version!
Traceback (most recent call last):
    File "/home/cfiet/projects/emscripten/emcc", line 1479, in <module>
        shared.Building.llvm_opt(final, link_opts, final + '.link.ll')
    File "/home/cfiet/projects/emscripten/tools/shared.py", line 1173, in llvm_opt
        assert os.path.exists(target), 'Failed to run llvm optimizations: ' + output
        AssertionError: Failed to run llvm optimizations: 
```

Bummer, still not working. Since the `llvm-nm` command seems to fail, I checked the version of
the tool:
```bash
cfiet@crunchbang:~/projects/emscripten$ llvm-nm --version
Low Level Virtual Machine (http://llvm.org/):
 llvm version 3.0
  (Debian 3.0-10)Optimized build.
 Built Jul 13 2012 (11:36:32).
 Host: x86_64-pc-linux-gnu
 Host CPU: corei7-avx
```

Ok, so I still have an old version of LLVM installed togather as default, even though during `clang-3.5`
installation, `llvm-3.5` was installed as well. So I tried to remove the old version with
```bash
sudo apt-get remove llvm
```

After that, attempting to compile the test file, failed with the following error:
```
cfiet@crunchbang:~/projects/emscripten$ ./em++ tests/hello_world.cpp
Traceback (most recent call last):
  File "/home/cfiet/projects/emscripten/emcc", line 1424, in <module>
    extra_files_to_link = system_libs.calculate(temp_files, in_temp, stdout, stderr)
  File "/home/cfiet/projects/emscripten/tools/system_libs.py", line 342, in calculate
    symbolses = map(lambda temp_file: shared.Building.llvm_nm(temp_file), temp_files)
  File "/home/cfiet/projects/emscripten/tools/system_libs.py", line 342, in <lambda>
    symbolses = map(lambda temp_file: shared.Building.llvm_nm(temp_file), temp_files)
  File "/home/cfiet/projects/emscripten/tools/shared.py", line 1217, in llvm_nm
    output = Popen([LLVM_NM, filename], stdout=stdout, stderr=stderr).communicate()[0]
  File "/usr/lib/python2.7/subprocess.py", line 679, in __init__
    errread, errwrite)
  File "/usr/lib/python2.7/subprocess.py", line 1259, in _execute_child
    raise child_exception
OSError: [Errno 2] No such file or directory
```

Seems that now, Emscripten cannot find `llvm-nm` at all, because the tool in `PATH` is called `llvm-nm-3.5`
that is a symbolic link to `/usr/lib/llvm-3.5/bin/llvm-nm`. However, Emscripten generates
a file `~/.emscripten` where you can customize paths to the tools it uses. So I just edited the file and
modified the line that sets up the `LLVM_ROOT` variable:
```python
#LLVM_ROOT = os.path.expanduser(os.getenv('LLVM') or '/usr/bin') # original version of the line
LLVM_ROOT = os.path.expanduser(os.getenv('LLVM') or '/usr/lib/llvm-3.5/bin')
```

Now, after trying to compile the test script I got the following:
```bash
cfiet@crunchbang:~/projects/emscripten$ ./em++ tests/hello_world.cpp
WARNING  root: (Emscripten: settings file has changed, clearing cache)
WARNING  root: LLVM version appears incorrect (seeing "version", expected "3.2")
INFO     root: (Emscripten: Running sanity checks)
cfiet@crunchbang:~/projects/emscripten$ node ./a.out.js
hello, world!
```

![It`s alive!](/img/posts/2014/it-s_alive.jpg)

Now, that Emscripten seem to work, and I`m all set to bring the Robbo back.

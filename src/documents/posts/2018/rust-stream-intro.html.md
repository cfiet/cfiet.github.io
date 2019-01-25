---
layout: single-post
title: "Rust live coding coming soon"
isPost: true
date: "2019-01-25 22:00"
tags: ["blog", "programming", "rust", "learning", "livestream"]
description: "Old man yells at a borrow checker!"
---

Since over the last couple of weeks I didn't feel like writing a long and
detailed blog posts about my experience with Rust, I've decided to
try something new. The plan is is to run a few live coding sessions on 
[Twitch](https://www.twitch.tv/derpusherpowsky) where I will be
learning Rust by building a real-world application while trying to determine
if [Rust is Web yet](http://www.arewewebyet.org/).

Here are some features I have in mind for the service:

<dl>
  <dt>Searches and downloads gifs via <a href="https://developers.giphy.com/docs/">Giphy API</a></dt>
  <dd>
    I want to use Rust to interface with HTTP APIs involving threading, resource management and
    maybe interfacing with a DB
  </dd>

  <dt>Re-sizes and re-packages selected image to be under desired size</dt>
  <dd>
    The idea here is to try using a native library to do the resizing and get the best quality
    in the desired file size range. I want to learn how to interface between Rust and native
    libraries and how to set up the toolchain for native code compilation and integration
  </dd>

  <dt>Re-encodes the packaged image so it can be downloaded or C&P base64 encoded</dt>
  <dd>
    Think <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs">HTML Data URI</a> format.
  </dd>

  <dt>Has a nice Web UI</dt>
  <dd>
    Learn some Rust for Frontend/Browser, play with WASM etc. I might give up on this one and just
    go with something I know better since I don't really want to spend too much time building and
    polishing a web UI
  </dd>

  <dt>Deploys on <a href="https://aws.amazon.com/lambda/">AWS Lambda</a></dt>
  <dd>
    I know that <a href="https://aws.amazon.com/blogs/opensource/rust-runtime-for-aws-lambda/">Rust for Lambda</a> is a thing.
    I want to see how mature it is and learn how to wire AWS Lambda and API Gateway together.
  </dd>
</dl>

The plan is quite ambitious and since I have no streaming experience it's all probably
end with a spectacular disaster, so stay tuned for some quality content.

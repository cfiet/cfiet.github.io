#  DocPad Configuration File
#  http://docpad.org/docs/config
#
#  Define the DocPad Configuration
moment = require "moment"

module.exports =
  
  port: 9778

  templateData:
    getUrl: (path) ->
      "http://blog.cfiet.net/#{path || ''}"

    site:
      title: "Strictly Lazy"
    
    getTitle: ->
      if @document.title then "#{@document.title} | #{@site.title}" else "#{@site.title}"
    
    getDateFromNow: (doc = @document) ->
      if doc.date then moment(doc.date).format("dddd, Do MMMM YYYY") else ""

    getDescription: (doc = @document) ->
      doc.description or @getHeaderContent(doc)
    
    getHeaderContent: (doc) ->
      content = doc.contentRenderedWithoutLayouts
      i = content?.search('<!-- Read more -->') 
      if i >= 0
        content[0..i-1]
      else
        content
    
    hasMore: (doc) ->
      not @isTopLevelDocument(doc) and doc.contentRenderedWithoutLayouts?.search('<!-- Read more -->') >= 0
    
    isTopLevelDocument: (doc) ->
      doc.url is @document.url

    isPost: () ->
      @document.relativePath.indexOf("posts") == 0
    
    nextPost: (doc = @document) ->
      if not doc.isPost then throw new Error("Not a post")
      posts = @getCollection("posts").toJSON()
      for i in [0 .. posts.length-1]
        if posts[i+1]?.id is doc.id then return posts[i]
      return null
    
    prevPost: (doc = @document) ->
      if not doc.isPost then throw new Error("Not a post")
      posts = @getCollection("posts").toJSON()
      for i in [1 .. posts.length]
        if posts[i-1]?.id is doc.id then return posts[i]
      return null
    
    assets:
      styles: [
        "/lib/bootstrap-3.4.0/css/bootstrap.min.css",
        "/lib/highlight.js/styles/github.css",
        "/style.css"
      ]
      scripts: [
        "/lib/jjquery-3.3.1.min.js",
        "/lib/bootstrap-3.4.0/js/bootstrap.min.js",
        "/lib/disqus.count.js",
        "/lib/disqus.embed.js"
      ]
  
  collections:
    menuItems: ->
      @getCollection("html").findAllLive(menuItem: $exists: true, [{menuItem: 1}])
    posts: ->
      @getCollection("html").findAllLive(isPost: true, hidden: $exists: false, [date: -1])

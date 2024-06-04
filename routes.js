function blog(args){
    var ret = args.get("post")
    template = new TemplateManager()
    return template.load_template("blog.html",{"Date":"xx.xx.xx","Title":":)","Contents":String(ret)})

}
blogroute = new Route("blog",blog)
route.add(blogroute)
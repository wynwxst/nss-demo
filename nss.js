function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function httpPost(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
// to set a page's html to x, document.body.innerHTML = x
function parseroute(){
    
}
class Route{
    constructor(route,callback){
        this.route = route
        this.cb = callback
    }
}
class RouteManager{
    constructor(rm={}){
        this.repomanager = rm
        this.routes = rm.routes
        this.routes = {}
        this.routes["GET"] = {}
        this.routes["POST"] = {}
    }
    parseargs(){
        var args = new URLSearchParams(window.location.search);
        return args
    }
    parsepath(){
        var path = document.location.pathname.replace("/" + this.repomanager.reponame,"")
        console.log(this.repomanager.reponame)
        return path
    }
    setcontent(content){
        document.body.innerHTML = String(content)
    }
    execute(){
        var ret = ""
        var path = this.parsepath()
        if (path.endsWith("/") == true){
            path = path.slice(0, -1)
        }
        if (path.startsWith("/") == true){
            path = path.substring(1)
        }
        console.log(path)
        if (this.routes[path] != undefined){
            var cb = this.routes[path]
            if (cb.length  == 1){
                ret = cb(this.parseargs())
            } else {
                ret = cb()
            }
        } else {
            return console.log("Not found")
        }
    console.log("ret:")
    console.log(ret)
    const loadcontent = this.setcontent
    window.onload = function(){
    loadcontent(ret)}


        

    }

    add(callback){
        // method support seems impossible unless through a browser check which is not rly method
        // parse route later
        console.log(callback)
        this.routes[callback.route] = callback.cb
        console.log(this.routes)
    }
}
class RepoManager{
    constructor(repourl,branch = "main",point="routes"){
        this.repo = repourl
        this.branch = branch
        this.point = point
        this.reponame = repourl.split("/")[1]
    }
    fetchfiles(){
        //https://api.github.com/repos/wynwxst/carnellion/git/trees/main
        var js =httpGet("https://api.github.com/repos/" + this.repo + "/git/trees/" + this.branch)
        return JSON.parse(js)

    }
    fetchfile(file){
        //https://raw.githubusercontent.com/wynwxst/carnellion/main/carnellion/lib.py
        var js =httpGet("https://raw.githubusercontent.com/" + this.repo + this.branch + this.point + file)
        return JSON.parse(js)

    }
    findfiles(dict=null){
        // implement folder stuff here
        // file: 100644? folder: 040000
        var data = {}
        var js = null
    if (dict == null){
        js = this.fetchfiles()
    } else {
        console.log(dict["tree"])
        js = dict
    }
    console.log(js.tree)
        var ar = js["tree"]
        console.log(ar)
        var arrayLength = ar.length
        for (var i = 0; i < arrayLength; i++) {
            console.log(ar[i].mode)
            if (ar[i].mode == "100644"){
            data[ar[i]["path"]] = ar[i]["sha"] 
            }
        }
        return data
    }
    findroutes(){
        var data = {}
        var routes = {}
        var js = this.fetchfiles()
        var ar = js["tree"]
        var arrayLength = ar.length
        for (var i = 0; i < arrayLength; i++) {
            console.log(ar[i].path == this.point)
            if (ar[i].path == this.point && ar[i].mode == "040000"){
                console.log(httpGet(ar[i].url))
                routes = this.findfiles(JSON.parse(httpGet(ar[i].url)))
            
                
            data[ar[i]["path"]] = ar[i]["sha"] 
            }
        }
        this.routes = routes
        return this.routes
    }
}


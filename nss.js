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
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// Define the string
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
    // do we wanna add the following directly into whatever html content will be served?
    //<script src="nss.js"></script>
    //<script type="module">
    //import { Octokit } from "https://esm.sh/@octokit/core";
    //</script>
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
class FileManager{
    constructor(repourl,branch = "main",point="files",oauth=null){
        if (oauth == null){
            console.log("Write/Delete disabled.")
            
            console.clear()
        }
        this.oauth = oauth // how tf did I typo this....
        this.repo = repourl
        this.branch = branch
        this.point = point
        this.reponame = repourl.split("/")[1]
        this.owner = repourl.split("/")[0]
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
    async write(file,content,options={"message":"","name":"","email":"",}){
        
        var lof = this.findfiles()
        if (file in lof){
            // modification
            const octokit = new Octokit({
                auth: this.oauth
              })
              // time to think about storing the oauth -> without this there's no point in creating write/delete funcs
              // localstorage -> X (that's asking for a disaster, might use for ~30s delay tho)
              // Json -> X (some room to test but this is like accessible through github pages)
              // maybe the runner can obfuscate their js files?
              // Perhaps pages settings deploy from main branch but get oauth through a request to -> X that would be needing an oauth to get an oauth
              // List of possible methods to store (in pages)
              // Localstorage (quickflash)
              // Json (Req, not even quick)
              // Cookie (quickflash)
              // Outsourced server (would still need to make the request....)
              // Htmledit (quickflash)
              // 

              
              let req = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: this.owner,
                repo: this.reponame,
                path: this.point + "/" + file,
                message: options.message,
                committer: {
                  name: options.name,
                  email: options.email
                },
                content: Base64(content),
                sha: lof[file], // is this the new sha or the old sha to verify which file you're taking?
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
                
              
        
            }
        
        )
        return req
              
        } else {
            // addition, why is there even a diff? -> probably for sha ? 
            // I wish the docs featured a working example
        }

    }
}


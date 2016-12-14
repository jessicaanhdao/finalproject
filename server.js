var http = require('http'),
    https = require('https'),
    request = require('request'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    archiver = require('archiver'),
    port = 8080;

var server = http.createServer(function(req, res) {
    var uri = url.parse(req.url)

    switch (uri.pathname) {
        case '/':
            sendFile(res, 'index.html')
            break
        case '/index.html':
            sendFile(res, 'index.html')
            break
        case '/js/index.js':
            sendFile(res, 'js/index.js')
            break
        case '/css/bootstrap.min.css':
            sendFile(res, 'css/bootstrap.min.css')
            break
        case '/submit':
            parsePOST(req, res);
            break
         case '/favicon.ico':
            sendFile(res, 'favicon.ico','image/x-icon')
            break
        case '/pictures.zip':
                fs.readFile("pictures.zip", function(error, content) {
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment'

                    })
                    res.end(content, 'utf-8')
                })
            break
        default:
            if(uri.pathname.includes("images")){
              var decodedURI = decodeURI(uri.pathname)
              decodedURI = decodedURI.substr(1);
              console.log("attempting to send " + decodedURI)
              sendFile(res, decodedURI, "image/jpeg")

            }
            else{
              res.end('404 not found')  
            }
            
    }
})
//requires a images/ folder to store images in.
var dir = './images';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function(error, content) {
        res.writeHead(200, {
            'Content-type': contentType
        })
        res.end(content, 'utf-8')
    })
}

//getRedditPosts();
//fetchImage(getRealImgurLink(
// "https://i.reddituploads.com/76dca79094c3489fa10391e9e26653db?fit=max&h=1536&w=1536&s=218d45e8186164d34447dadc1532c00e")
//, "TEST Northern Vietnam [OC] [960x720")


//had help from : http://www.codingdefined.com/2015/12/get-latest-reddit-posts-in-nodejs.html
function getRedditPosts(subreddit, category, clientResponse) {
    var queryCount = 10;
    var url = "https://www.reddit.com/r/" + subreddit + "/" + category + "/.json?limit=" + queryCount;

    var request = https.get(url, function(response) {
            var json = '';
            response.on('data', function(chunk) {
                console.log("processing...")
                json += chunk;
            });

            response.on('end', function() {
                    var redditResponse = JSON.parse(json);
                    var currentCount = 0;
                    var returnedCount = redditResponse.data.children.length;
                    redditResponse.data.children.forEach(function(child) {
                            currentCount = currentCount + 1;

                            if (child.data.domain !== 'self.node') {
                                console.log('-------------------------------');
                                console.log('Author : ' + child.data.author);
                                console.log('Domain : ' + child.data.domain);
                                console.log('Title : ' + child.data.title);
                                console.log('URL : ' + child.data.url);

                                if (child.data.domain === "i.imgur.com" || child.data.domain === "i.reddituploads.com" || child.data.domain == "i.redd.it" || child.data.domain === "imgur.com" ||
                                  child.data.url.includes("jpg") || child.data.url.includes("jpeg")  || child.data.url.includes("png")) {
                                    var sanitizedURL = sanitizeURL(child.data.url) // removes &amp; and appends .jpeg if none exists
                                        //removes &amp; and removes '.' to prevent problems with file extension
                                        //also removes " and , 
                                    var sanitizedTitle = sanitizeTitle(child.data.title)

                                    var shortenedTitle = shortenTitle(sanitizedTitle);
                                    var filePath = "images/" + shortenedTitle;
                                    fetchImage(sanitizedURL, filePath, clientResponse, returnedCount, currentCount)
                                }
                                 
                            }

                           
                       
                    });
            }) // end request on end
    }); // end http get

  request.on('error', function(err) {
      console.log(err);
  });
}


var imagePaths = []

function fetchImage(url, filePath, clientResponse, totalCount, currentCount) {
    //handle werid json &
    console.log("fetching: " + url)
    try {
        request.head(url, function(err, res, body) {
            //append file extension
            filePathWithExt = filePath + translateContentType(res.headers['content-type'])
            imagePaths.push(filePathWithExt);
            request(url).pipe(fs.createWriteStream(filePathWithExt)).on('close', function() {
                console.log("finished downloading : " + filePathWithExt);
                if(currentCount == totalCount){//if processing the last child
                    //zip up all the files
                    zipPictures();

                    sendBackXMLHTTPResponse(clientResponse);
                }               

            });

        });
    } catch (err) {

        console.log(err);

    }
};

//help from : http://stackoverflow.com/questions/15641243/need-to-zip-an-entire-directory-using-node-js
function zipPictures(){
    var output = fs.createWriteStream('pictures.zip');
    var archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function(err){
        throw err;
    });

    archive.pipe(output);
    imagePaths.forEach(function (imagePath){
        archive.append(fs.createReadStream(imagePath), { name: imagePath });

    })
    archive.finalize();
}

function sendBackXMLHTTPResponse(res) {
  console.log(JSON.stringify(imagePaths));
    var contentType = 'text/html';
    res.writeHead(200, {
        'Content-type': contentType
    })
    res.end(JSON.stringify(imagePaths), 'utf-8')

    imagePaths = []

}


function sanitizeTitle(title) {
    //replaces '&' and '.'
    sanitizedTitle = title.replace(/&amp;/g, "&").replace(/\./g, '').replace(/\"/g, '').replace(/\,/g, '').replace(/\|/g, '');

    return sanitizedTitle;
}


//get the first five words
function shortenTitle(sanatizedTitle) {
    return sanatizedTitle.split(/\s+/).slice(0, 5).join(" ")
}

function translateContentType(contentType) {
    switch (contentType) {
        case "image/jpeg":
            return ".jpeg"
        case "image/png":
            return ".png"
        case "image/gif":
            return ".gif"
        case "image/bmp":
            return ".bmp"
        default:
            return ".jpeg"

    }
}


function sanitizeURL(link) {
    sanitizedURL = link.replace(/&amp;/g, "&");

    try {
        if (link.includes("imgur") && !link.includes("gallery") && !link.includes("jpg") &&
            !link.includes("jpeg") && !link.includes("png")) //imgur doesnt append on .jpeg to its urls
            return sanitizedURL + ".jpeg";
        if (link.includes("reddituploads")) //neither does reddit
            return sanitizedURL + ".jpeg"
        else //but all others usually do.
            return sanitizedURL;
    } catch (err) { // weird cases where link might be 'undefined'
        console.log(err);
        return sanitizedURL
    }
}

//from http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js/8640308#8640308
//type is add or remove
function parsePOST(request, clientResponse) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function(data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function() {

            var POST = querystring.parse(body);

            var subRedditName = POST.subreddit;

            var categoryName = POST.category;
            console.log(subRedditName, categoryName);

            getRedditPosts(subRedditName, categoryName, clientResponse);
        })
    }
}
function closeDialog() {
  	$("#loading").hide();
} 

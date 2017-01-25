Reddit Photos Downloader

===
by Anh Dao & Yuan Wen
---
http://cs4241-fp-willwen.herokuapp.com/

P.S. Use app "Image 2 Wallpaper" to set wall papers on android without losing resolution. Android is weird about dimensions of an image.

<h2>What Happens?</h2>
User selects subreddit and category.
Hitting submit creates a XMLHttpRequest to the server, sending along those two parameters. 
Server goes to reddit.com/r/subreddit/category/.json to retrieve the json format of 25 posts.
Server sanitizes and filters out (to the best of its ability) valid links for images
Server sends a request for each link and downloads the images in /images directory. 
On final image, server zips up all images created and sends a Response back to the client, with the whole JSON list of image file paths that were downloaded. 
Client updates the carousel through dom manipulation and many child calls to set the src of an image to the the ones just received.


<h2>HTML Design - Bootstrap :</h2>
Carousel, create a carousel for images
Form, to let users choose what to download
Modal, to pop up progress bar when fetching images
Progress, progress-bar, for visual progress bar 
Button, to format better-look buttons
Glyphicon, to show download icon


<h2>Node Modules:</h2>
Https , reddit won’t let you request their page without it
Request, to fetch and download images from different sites
Fs, to save and make a directory on the file system
QueryString, to parse a POST request
Archiver, to save and zip up all files 



<h2>Shortcomings:</h2>
There are hosting sites, such as flickr which make finding the definite path of the jpeg hard. For example
Some posts on the subreddit are all text, and their link domain is self.reddit, thus not an image at all. An example is : 
<ul>
	<li>Post: <a href="https://www.reddit.com/r/EarthPorn/comments/5icfi1/waterfall_in_great_smoky_mountain_national_park/">https://www.reddit.com/r/EarthPorn/comments/5icfi1/waterfall_in_great_smoky_mountain_national_park/</a> </li>
	<li>Links to :
    <a href="https://www.flickr.com/photos/130960286@N02/30586628271/sizes/o/"> https://www.flickr.com/photos/130960286@N02/30586628271/sizes/o/ </a> </li>
	<li>Actual Image Address:
    <a href=" https://c2.staticflickr.com/6/5491/30586628271_11904372c5_o.jpg"> https://c2.staticflickr.com/6/5491/30586628271_11904372c5_o.jpg</a> </li>
</ul>
<br>We would have liked to create new carousel slides depending on how many images we receive from the server, but we ran out of time. Thus we used a static 12 slides.
<br>The above problems make counting to a number of images difficult because no matter if the link was a picture or not, our program saves it as a jpeg. Thus sometimes, our file formats are unrecognizable.


</body>
</html>

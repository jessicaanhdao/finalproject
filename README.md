<html lang="en">
  <head>
    <title>Anh Dao - CS4241 Assignment 6</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
   	
    <link href="https://fonts.googleapis.com/css?family=Jura" rel="stylesheet">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">
</head>

<body class="container">

<h4><i>by Anh Dao & Yuan Wen</i></h4>


<h2>High Level Of What Happens:</h2>
    <p>User selects subreddit and category.
	<br>Hitting submit creates a XMLHttpRequest to the server, sending along those two parameters.
	<br>Server goes to reddit.com/r/subreddit/category/.json to retrieve the json format of 25 posts.
	<br>Server sanitizes and filters out (to the best of its ability) valid links for images
	<br>Server sends a request for each link and downloads the images in /images directory. 
	<br>On final image, server zips up all images created and sends a Response back to the client, with the whole JSON list of image file paths that were downloaded. 
	<br>Client updates the carousel through dom manipulation and many child calls to set the src of an image to the the ones just received.
</p>

<h2>HTML Design - Bootstrap :</h2>
	<p>Carousel, create a carousel for images
<br>Form, to let users choose what to download
<br>Modal, to pop up progress bar when fetching images
<br>Progress, progress-bar, for visual progress bar 
<br>Button, to format better-look buttons
<br>Glyphicon, to show download icon
</p>

<h2>Node Modules:</h2>
<p>Https , reddit won’t let you request their page without it
<br>Request, to fetch and download images from different sites
<br>Fs, to save and make a directory on the file system
<br>QueryString, to parse a POST request
<br>Archiver, to save and zip up all files 
</p>



<h2>Shortcomings:</h2>
	<p> There are hosting sites, such as flickr which make finding the definite path of the jpeg hard. For example
<br>Some posts on the subreddit are all text, and their link domain is self.reddit, thus not an image at all. An example is : 
<ul>
	<li>Post: <a href="https://www.reddit.com/r/EarthPorn/comments/5icfi1/waterfall_in_great_smoky_mountain_national_park/">https://www.reddit.com/r/EarthPorn/comments/5icfi1/waterfall_in_great_smoky_mountain_national_park/</a> </li>
	<li>Links to :
    <a href="https://www.flickr.com/photos/130960286@N02/30586628271/sizes/o/"> https://www.flickr.com/photos/130960286@N02/30586628271/sizes/o/ </a> </li>
	<li>Actual Image Address:
    <a href=" https://c2.staticflickr.com/6/5491/30586628271_11904372c5_o.jpg"> https://c2.staticflickr.com/6/5491/30586628271_11904372c5_o.jpg</a> </li>
</ul>
<br>We would have liked to create new carousel slides depending on how many images we receive from the server, but we ran out of time. Thus we used a static 12 slides.
<br>The above problems make counting to a number of images difficult because no matter if the link was a picture or not, our program saves it as a jpeg. Thus sometimes, our file formats are unrecognizable.
</p>

<h2>Known Bugs:</h2>
	<p>Some photos will only show half on the carousel but are in full in the .zip file.
</p>

</body>
</html>


function getParams(){
  var subredditName = $('input[name=subredditRadio]:checked').val();
  var categoryName = $('#redditCategory').find(":selected").text();
  makeRequestPost(subredditName,categoryName);
}

window.onload = function(){
	 document.getElementById("submitButton").onclick =  function() { getParams()};
}
 
function makeRequestPost(subreddit, category){
  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }
  httpRequest.onload = alertContents;
  httpRequest.open("POST", "/submit");
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  httpRequest.send("subreddit" + "=" + encodeURIComponent(subreddit) + "&" + "category"+"="+encodeURIComponent(category));
}

function alertContents() {
    try { 
      //debugger;
      // if (httpRequest.readyState === XMLHttpRequest.DONE) {
      //   if (httpRequest.status === 200) {

    		
          // document.getElementById("unorderedList").innerHTML =httpRequest.responseText;
          // document.getElementById("specialMessage").innerHTML = "Here you are!";
          console.log(httpRequest.responseText);
          var imagePaths = JSON.parse(httpRequest.responseText);
		  var carousel = $('.carousel');
		  //carousel[0].children[1].children  gives you 4 div items
		  var divs = carousel[0].children[1].children
		  for (var i = 0; i < divs.length ; i++){
			  divs[i].children[0].src=  imagePaths[i];		 	
		  }
		   $('#loading').modal('hide');
    }
    catch( e ) {
      alert("Caught Exception: " + e.description);
    }
} 

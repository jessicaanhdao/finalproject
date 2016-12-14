
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
          //var response = JSON.parse(httpRequest.responseText);
          //alert(response.computedString);
          console.log(httpRequest.responseText);
		  var carousel = $('.carousel');
		  //carousel[0].children[1].children  gives you 4 div items
		  document.getElementById("active").src=  httpRequest.responseText;
      //   } else {
      //     alert("There was a problem with the request.");
      //   }
      // }
    }
    catch( e ) {
      alert("Caught Exception: " + e.description);
    }
} 

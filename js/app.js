var app = angular.module('reddit-camouflage',[])
  .config(['$routeProvider',
    function($routeProvider){
  $routeProvider.
  when('/overflow', {
    templateUrl:"templates/overflow_template.html",
    controller:'overflowController'   
  }).
  when('/post', {
    templateUrl:"templates/overflow_post_template.html",
    controller:'overflowPostController'   
  }).
  otherwise({redirectTo:'/overflow',
});

 function foo(data) {
 	console.log("hello");
 }

}]).controller('overflowController',function($scope, $routeParams){
	var url='https://www.reddit.com/.json?3jsonp=?'
	$scope.posts=[];
	if(localStorage.getItem("overflow_title"))
		$scope.overflow_title=localStorage.getItem("overflow_title");
	else
		$scope.overflow_title="The Definitive C++ Book Guide and List";

	$.get(url,{},function(response) {
      var subRedditsArray=response.data.children;
	   for (var i = 0; i < subRedditsArray.length; i++) {
			$scope.posts.push({
				title:subRedditsArray[i].data.title,
				author:subRedditsArray[i].data.author,
				subreddit:subRedditsArray[i].data.subreddit,
				domain:subRedditsArray[i].data.domain,
				permalink:subRedditsArray[i].data.permalink,
				score:subRedditsArray[i].data.score,
				type:subRedditsArray[i].data.post_hint,
				thumbnail:{thumbnail_url:subRedditsArray[i].data.thumbnail,width:subRedditsArray[i].data.width,height:subRedditsArray[i].data.height},
				num_comments:subRedditsArray[i].data.num_comments,
				selfText:subRedditsArray[i].data.selftext,
				selfTextShort:subRedditsArray[i].data.selftext.substr(0, 500),
				expanded:false,
				url:subRedditsArray[i].data.url});
		}
		$scope.$apply();
    });


	$scope.editTitle =function() {
		console.log("edit title");
		document.getElementById('subPost_title_content').style.display="none";
		document.getElementById('subPost_title_content_input').style.display="initial";
		document.getElementById('subPost_title_content_input').focus();
	};

	$scope.displayEdit =function() {
		clearTimeout(hideTimeout);
		document.getElementById("display_button").style.display="inline-block";
	};

	$scope.hideEdit =function() {
		clearTimeout(hideTimeout);
		hideTimeout=setTimeout(function(){document.getElementById("display_button").style.display="none";},1000);
	};

	$scope.compressSelftText =  function(post)
	{
		post.expanded =  false;
	}

	$scope.expandSelfText =  function (post) {
		post.expanded = true;
	}
})
.controller('overflowPostController',function($scope, $routeParams){
	//ToDo  get reddit post from url params
	var url='https://www.reddit.com/r/gifs/comments/3ub1il/my_way_is_quicker/.json?3jsonp=?'
	$scope.posts = [];
	$scope.comments = [];
	if(localStorage.getItem("overflow_title"))
		$scope.overflow_title = localStorage.getItem("overflow_title");
	else
		$scope.overflow_title = "The Definitive C++ Book Guide and List";

	$.get(url,{},function(response) {
	  var postCommments = response[1].data.children;
	  for (var i = 0; i < postCommments.length; i++) {
	  	if(postCommments[i].data.author == "PM_ME_PAYPALMONEY")
	  		console.log(postCommments[i].data);
	  	$scope.comments.push({
	  		author:postCommments[i].data.author,
	  		body:postCommments[i].data.body,
	  		score:postCommments[i].data.score
	  	})
	  };


      var subRedditsArray = response[0].data.children;
      for (var i = 0; i < subRedditsArray.length; i++) {
			$scope.posts.push({
				title:subRedditsArray[i].data.title,
				author:subRedditsArray[i].data.author,
				subreddit:subRedditsArray[i].data.subreddit,
				domain:subRedditsArray[i].data.domain,
				permalink:subRedditsArray[i].data.permalink,
				score:subRedditsArray[i].data.score,
				type:subRedditsArray[i].data.post_hint,
				thumbnail:{thumbnail_url:subRedditsArray[i].data.thumbnail,width:subRedditsArray[i].data.width,height:subRedditsArray[i].data.height},
				num_comments:subRedditsArray[i].data.num_comments,
				selfText:subRedditsArray[i].data.selftext,
				selfTextShort:subRedditsArray[i].data.selftext.substr(0, 500),
				expanded:false,
				url:subRedditsArray[i].data.url});
		}
	$scope.$apply();
    });


	$scope.editTitle =function() {
		console.log("edit title");
		document.getElementById('subPost_title_content').style.display="none";
		document.getElementById('subPost_title_content_input').style.display="initial";
		document.getElementById('subPost_title_content_input').focus();
	};

	$scope.displayEdit =function() {
		clearTimeout(hideTimeout);
		document.getElementById("display_button").style.display="inline-block";
	};

	$scope.hideEdit =function() {
		clearTimeout(hideTimeout);
		hideTimeout=setTimeout(function(){document.getElementById("display_button").style.display="none";},1000);
	};

	$scope.compressSelftText =  function(post)
	{
		post.expanded =  false;
	}

	$scope.expandSelfText =  function (post) {
		post.expanded = true;
	}
});
var hideTimeout;

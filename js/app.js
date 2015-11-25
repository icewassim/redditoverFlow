var app = angular.module('reddit-camouflage',[])
  .config(['$routeProvider',
    function($routeProvider){
  $routeProvider.
  when('/overflow', {
    templateUrl:"overflow_template.html",
    controller:'overflowController'   
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
				time:timeDifference(subRedditsArray[i].data.created),
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
var hideTimeout;

function timeDifference(unix_timestamp) {
	var previous = new Date(unix_timestamp*1000);
    var current= new Date();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
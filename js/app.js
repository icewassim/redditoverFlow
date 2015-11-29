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
}]).controller('overflowController',function($scope, $routeParams){
	var url='https://www.reddit.com/.json?3jsonp=?'
	$scope.posts=[];

  if(localStorage.getItem("overflow_title"))
		$scope.overflow_title=localStorage.getItem("overflow_title");
	else
		$scope.overflow_title="The Definitive C++ Book Guide and List";

	$.get(url,{},function(response) {
      $scope.posts = response.data.children.map(function (post) {
        return {
          title:post.title,
          author:post.author,
          subreddit:post.subreddit,
          domain:post.domain,
          permalink:post.permalink,
          score:post.score,
          type:post.post_hint,
          thumbnail:{thumbnail_url:post.thumbnail,width:post.width,height:post.height},
          num_comments:post.num_comments,
          selfText:post.selftext,
          selfTextShort:post.selftext.substr(0, 500),
          expanded:false,
          url:post.url
      };
    });
		$scope.$apply();
  });


	$scope.editTitle =function() {
		console.log("edit title");
		document.getElementById('subPost_title_content').style.display = "none";
		document.getElementById('subPost_title_content_input').style.display = "initial";
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
	var url='https://www.reddit.com/r/AskReddit/comments/3unb5b/.json?3jsonp=?'
	$scope.posts = [];
	$scope.comments = [];
	if(localStorage.getItem("overflow_title"))
		$scope.overflow_title = localStorage.getItem("overflow_title");
	else
		$scope.overflow_title = "The Definitive C++ Book Guide and List";

	$.get(url,{},function(response) {
    console.log(response);
    $scope.comments = response[1].data.children.map(function(comment) {
      return {
        author:comment.data.author,
        body:comment.data.body,
        score:comment.data.score,
        replies:comment.data.replies ? comment.data.replies.data.children.map(function (reply) {
          return {
                  content:reply.data.body,
                  author:reply.data.author,
                  score:reply.data.score
                };
        }):null
      }
    })

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

	$scope.editTitle = function() {
		document.getElementById('subPost_title_content').style.display="none";
		document.getElementById('subPost_title_content_input').style.display="initial";
		document.getElementById('subPost_title_content_input').focus();
	};

	$scope.displayEdit = function() {
		clearTimeout(hideTimeout);
		document.getElementById("display_button").style.display="inline-block";
	};

	$scope.hideEdit = function() {
		clearTimeout(hideTimeout);
		hideTimeout=setTimeout(function(){document.getElementById("display_button").style.display="none";},1000);
	};

	$scope.compressSelftText = function(post)
	{
		post.expanded =  false;
	}

	$scope.expandSelfText =  function (post) {
		post.expanded = true;
	}
});
var hideTimeout;

angular.module('reddit-camouflage',[])
  .config(['$routeProvider',
    function($routeProvider){
  $routeProvider.
  when('/r/:subreddit', {
    templateUrl:"templates/overflow_template.html",
    controller:'overflowController'
  }).
  when('/comments/:subreddit/:postId', {
    templateUrl:"templates/overflow_post_template.html",
    controller:'overflowPostController'
  }).
  otherwise({redirectTo:'/r/front',
});
}])
.filter('to_trusted', ['$sce', function($sce){
      return function(text) {
          return $sce.trustAsHtml(text);
      }
 }])
.controller('overflowController',function($scope, $routeParams){
	$scope.posts=[];
  if($routeParams.subreddit === "front")
    var url='https://www.reddit.com/.json?3jsonp=?';
  else
    var url='https://www.reddit.com/r/'+$routeParams.subreddit+'.json';

  if(localStorage.getItem("overflow_title"))
		$scope.overflow_title=localStorage.getItem("overflow_title");
	else
		$scope.overflow_title="The Definitive C++ Book Guide and List";

	$.get(url,{},function(response) {
      $scope.posts = response.data.children.map(function (post) {
        return {
          postId:post.data.id,
          title:post.data.title,
          author:post.data.author,
          subreddit:post.data.subreddit,
          domain:post.data.domain,
          permalink:post.data.permalink,
          score:post.data.score,
          type:post.data.post_hint,
          thumbnail:post.data.thumbnail.indexOf("http") !== -1?{
                      thumbnail_url:post.data.thumbnail,
                      width:post.data.width,
                      height:post.data.height,
                      original:post.data.url
                    }:null,
          num_comments:post.data.num_comments,
          selfText:post.data.selftext,
          selfTextShort:post.data.selftext.substr(0, 500),
          expanded:false,
          url:post.data.url
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

  $scope.expandHoveredContent = function(post) {
    post.showHovered = true;
    console.log(post.showHovered)
  }

  $scope.hideHoveredContent = function(post) {
    post.showHovered = false;
  }

  $scope.expandSelfText =  function (post) {
    post.expanded = true;
  }
})

.controller('overflowPostController',function($scope, $routeParams){
  var url='https://www.reddit.com/r/'+$routeParams.subreddit+'/comments/'+$routeParams.postId+'/.json?3jsonp=?'
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

  $scope.compressSelftText = function(post) {
    post.expanded =  false;
  }



	$scope.expandSelfText =  function (post) {
		post.expanded = true;
	}
});
var hideTimeout;

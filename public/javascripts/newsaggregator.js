var app = angular.module('NewsAggregator', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/Home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-article' , {
            templateUrl: 'partials/article-form.html',
            controller: 'AddArticleCtrl'
        })
        .when('/viewcomments/:articleid', {
            templateUrl: 'partials/comments-section.html',
            controller: 'GetArticle'
        })
        .otherwise({ redirectTo: '/'
    });
}]);


app.controller('HomeCtrl', ['$scope', '$resource', '$location', function($scope, $resource, $location){
    var articles = $resource('/api/articles');
    articles.query(function(articles){
        $scope.articles = articles;
    });

    /*
    * Method section
    */
    $scope.GetArticle = function(id){
        $location.url('/viewcomments/'+id);        
    };
    $scope.AddArticle = function(){
        $location.url('/add-article');
    }
    $scope.DeleteArticle = function(id){
        var a = $resource('/api/articles/'+ id);
        a.delete();
        var articles = $resource('/api/articles');
        articles.query(function(articles){
            $scope.articles = articles;
        });
    }
    $scope.UpVote = function(id, index){
        console.log(index);
        var a = $resource('/api/articles/'+ id + '/add', {}, {
            update: {
              method: 'PUT'
            }
        });
        a.update(function(article){
            $scope.articles[index] = article;
        });      
    }
    $scope.DownVote = function(id, index){
        console.log(index);
        var a = $resource('/api/articles/'+ id + '/sub', {}, {
            update: {
              method: 'PUT'
            }
        });
        a.update(function(article){
            $scope.articles[index] = article;
        });   
    }
}]);

app.controller('AddArticleCtrl' , ['$scope', '$resource', '$location', 
    function($scope, $resource, $location){
        $scope.save = function(){
            var articles = $resource('/api/articles');
            articles.save($scope.article, function(){
                $location.path('/');
        });
    };
}]);

app.controller('GetArticle', ['$scope','$resource', '$location', '$routeParams', function($scope, $resource, $location, $routeParams){
    var article = $resource('/api/articles/'+ $routeParams.articleid);

    article.get(function(article){
        $scope.article = article;                
    });

    $scope.AddComment  = function(){
        article.save($scope.comment, function(article){
            $scope.article = article;
            $scope.comment = {};
            $scope.AddCommentsForm.$setPristine(); 
        });
    }

    $scope.Delete = function(commentid){
        console.log("comment id =" +commentid);
        var a = $resource('/api/articles/'+ $routeParams.articleid + '/' + commentid);
        a.delete(function(article){
            $scope.article = article;
        });
    }
    
    $scope.GoHome = function(){
        $location.path('/');
    }

    $scope.UpVote = function(commentID, articleID){
        var a = $resource('/api/articles/'+ articleID + '/' + commentID + '/add', {}, {
            update: {
              method: 'PUT'
            }
        });
        a.update(function(article){
            $scope.article = article;
        }); 
    }

    $scope.DownVote = function(commentID, articleID){
        var a = $resource('/api/articles/'+ articleID + '/' + commentID + '/sub', {}, {
            update: {
              method: 'PUT'
            }
        });
        a.update(function(article){
            $scope.article = article;
        }); 
    }

}]);

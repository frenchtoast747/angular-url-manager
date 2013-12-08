var app = angular.module('app', ['url.manager', 'ngRoute']);


app.config(['urlManagerProvider', function(urlManagerProvider){
    urlManagerProvider
        .addUrlPattern('ColorListView', '/', {
            templateUrl: 'color_list.html',
            controller : 'ColorListCtrl'
        })
        .addUrlPattern('ColorDetailView', '/colors/:name/:hex/', {
            templateUrl: 'color_detail.html',
            controller : 'ColorDetailCtrl'
        })
        .otherwise({
            redirectTo: 'nope'
        });
}]);

app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});


app.controller('ColorListCtrl', function($scope){
   $scope.colors = [
       {
           name: "red",
           hex: "f00"
       },
       {
           name: "green",
           hex: "0f0"
       },
       {
           name: "blue",
           hex: "00f"
       },
       {
           name: "cyan",
           hex: "0ff"
       },
       {
           name: "magenta",
           hex: "f0f"
       },
       {
           name: "yellow",
           hex: "ff0"
       },
       {
           name: "black",
           hex: "000"
       }
   ];
});


app.controller('ColorDetailCtrl', function($scope, $routeParams){
    $scope.colorName = $routeParams.name;
    $scope.colorValue = $routeParams.hex;
});

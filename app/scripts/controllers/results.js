'use strict';

/**
 * @ngdoc function
 * @name plusUiPrototypeApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the plusUiPrototypeApp
 */
angular.module('plusUiPrototypeApp')
  .controller('ResultsCtrl', function ($scope,$rootScope) {
  $scope.$on('$routeChangeSuccess', function (event, data) {
    $rootScope.pageTitle = data.title;
  });
});

'use strict';

/**
 * @ngdoc function
 * @name plusUiPrototypeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the plusUiPrototypeApp
 */
angular.module('plusUiPrototypeApp')
  .controller('AboutCtrl', function ($scope,$rootScope) {
  $scope.$on('$routeChangeSuccess', function (event, data) {
    $rootScope.pageTitle = data.title;
  });
  });

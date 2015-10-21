'use strict';

/**
 * @ngdoc overview
 * @name plusUiPrototypeApp
 * @description
 * # plusUiPrototypeApp
 *
 * Main module of the application.
 */
angular
  .module('plusUiPrototypeApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-spinkit',
    'datatables',
    'infinite-scroll'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
      title: 'Search Plus Data'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        title: 'About'
      })
      .when('/additionalDetails', {
      templateUrl: 'views/additionalDetails.html',
      title: 'AdditionalDetails'
    });
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  });

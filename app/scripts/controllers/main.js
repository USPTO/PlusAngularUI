'use strict';

/**
 * @ngdoc function
 * @name plusUiPrototypeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the plusUiPrototypeApp
 */
angular.module('plusUiPrototypeApp')
  .controller('MainCtrl', function ($scope,$rootScope,$location,$http) {


  //Add this to have access to a global variable
  angular.module('plusUiPrototypeApp').run(function ($rootScope) {
    $rootScope.searchRequestQuery = ''; //global variable
    $rootScope.start='';
    $rootScope.end = '';
    $rootScope.numberOfDocs =0;
    $rootScope.allDocuments = [];
  });

  $scope.$on('$routeChangeSuccess', function (event, data) {
    $rootScope.pageTitle = data.title;
    $rootScope.totalDocuments="";
    var url="http://plus-orig-pto-1554617097.us-east-1.elb.amazonaws.com/solr/collection1/select?q=*.*&wt=json&indent=true";
    $http.get(url).success(function(data) {
      $rootScope.totalDocuments=data.response.numFound;
    });
  });
  $scope.submit = function() {
    $rootScope.start=0;
    $rootScope.end=5;
    $rootScope.showSpinner = true;
    $rootScope.noResultsFlag = false;
    if ($scope.userquery !== undefined) {
      $rootScope.searchRequestQuery = $scope.userquery.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    $rootScope.trimmedText = $rootScope.searchRequestQuery;
    var url="http://plus-orig-pto-1554617097.us-east-1.elb.amazonaws.com/solr/collection1/"+
        "select?q="+$rootScope.searchRequestQuery+"&start="+$rootScope.start+"&rows="+$rootScope.end+"&wt=json&indent=true";
    $http.get(url).
    success(function(data) {
      $rootScope.showSpinner = false;
      $rootScope.initialStatus=true;
      $rootScope.numberOfDocs = data.response.numFound;
      $rootScope.allDocuments = data.response.docs;
      $rootScope.docList = true;
      //$('#docList').show();
    }).error(function(data, status) {
      $rootScope.showSpinner = false;
      if ( status === "404") {
        $rootScope.noResultsFlag = true;
      }
    });

    $rootScope.showDetail = function (u) {
      if ($rootScope.active !== u.id) {
        $rootScope.active = u.id;
      }
      else {
        $rootScope.active = null;
      }
    };
    $rootScope.loadCPCClassificationFacets();
  };

  // Start of infinite scrolling
  $rootScope.loadDetails = function() {
    if ($rootScope.start<=$rootScope.numberOfDocs){
      if ($rootScope.start=== undefined){
        $rootScope.start =0;
      }else{
        $rootScope.start =$rootScope.start+5;
      }
      $rootScope.end=5;
      var url="http://plus-orig-pto-1554617097.us-east-1.elb.amazonaws.com/solr/collection1/"+
          "select?q="+$rootScope.searchRequestQuery+"&start="+$rootScope.start+"&rows="+$rootScope.end+"&wt=json&indent=true";
      $http.get(url).success(function(data) {
        $rootScope.docs = data.response.docs;
        for (var i = 0; i < $rootScope.docs.length; i++) {
          $rootScope.allDocuments.push($rootScope.docs[i]);
        }
      }).error(function(data, status) {
        $rootScope.showSpinner = false;
        if ( status === "404") {
          $rootScope.noResultsFlag = true;
        }
      });
    }
  };
  // End of infinite scrolling
  /**
     * Facet result
     * @param Value
     * @param Score
     */
  $scope.cpcFacetItems = [];

  function FacetResult(Value, Score) {
    this.value = Value;
    this.score = Score;
  }
  $rootScope.loadCPCClassificationFacets = function() {
    var url="http://plus-orig-pto-1554617097.us-east-1.elb.amazonaws.com/solr/collection1/"+
        "select?q="+$rootScope.searchRequestQuery+
        "&rows=0&wt=json&facet=true&facet.field=cpc_classification&facet.mincount=1&facet.sort=count";
    $http.get(url).success(function(data) {
      var results = data.facet_counts;
      if (results && results.hasOwnProperty('facet_fields')) {
          var facet_fields = results.facet_fields.cpc_classification;
        for (var i=0; i< facet_fields.length; i+=2) {
          var value = facet_fields[i];
          var count = facet_fields[i+1];
          var facet = new FacetResult(value,count);
          $scope.cpcFacetItems.push(facet);
          $rootScope.cpc_classification= $scope.cpcFacetItems;
        }
      }
    }).error(function(data, status) {
      $rootScope.showSpinner = false;
      if ( status === "404") {
        $rootScope.noResultsFlag = true;
      }
    });
  };

  $rootScope.add = function(value) {
    $rootScope.start=0;
    $rootScope.end=5;
    var url="http://plus-orig-pto-1554617097.us-east-1.elb.amazonaws.com/solr/collection1/"+
        "select?q="+$rootScope.searchRequestQuery+
        "&fq=cpc_classification:("+value+")"+
        "&start="+$rootScope.start+"&rows="+$rootScope.end+"&wt=json&indent=true";
    $http.get(url).
    success(function(data) {
      $rootScope.numberOfDocs = data.response.numFound;
      $rootScope.allDocuments = data.response.docs;
      $rootScope.docList = true;
      //$('#docList').show();
    }).error(function(data, status) {
      $rootScope.showSpinner = false;
      if ( status === "404") {
        $rootScope.noResultsFlag = true;
      }
    });
  };
  $rootScope.additionalDetails = function(value) {
    $rootScope.drillDownValues = value;
  };
});

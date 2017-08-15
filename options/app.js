(function() {
  const Iago = angular.module('iago', ['ui.router']);

  Iago.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state({
      name: 'root',
      url: '/',
      controller: 'root',
      controllerAs: '$ctrl',
      templateUrl: './templates/index.html',
      resolve: {
        snippets: ['SnippetsService', function (SnippetsService) {
          return SnippetsService.all();
        }]
      }
    });

    $urlRouterProvider.otherwise('/');
  }]);


  Iago.controller('root', ['snippets', 'SnippetsService', function(snippets, SnippetsService) {
    var vm = this;

    vm.snippets = snippets;

    vm.pushSnippet = () => {
      vm.snippets.push( SnippetsService.createEmpty() );
    }

  }]);

  Iago.factory('SnippetsService', ['$http', '$q', function($http, $q) {
    const ApiPath = 'https://19v49q9wg3.execute-api.eu-central-1.amazonaws.com/dev/snippets';

    function sanitize(snippetRaw) {
      return {
        "title"    : snippetRaw.title,
        "content"  : snippetRaw.content,
        "langage"  : snippetRaw.langage
      };
    }

    return {
      createEmpty: () => {
        return {
          title: '', content: '', langage: ''
        }
      },
      all: () => {
        return new $q((resolve, reject) => {
          $http
            .get(ApiPath)
            .then(
              (response) => {
                resolve(response.data);
              }
            );

        });
      },
      create: (snippet) => {
        return new $q((resolve, reject) => {

          const data = sanitize(snippet);

          $http
            .post(ApiPath, data)
            .then(
              (response) => {
                resolve(response.data);
              }
            );
        });
      },
      update: (snippet) => {
        return new $q((resolve, reject) => {

          const data = sanitize(snippet);

          $http
            .put(`${ApiPath}/${snippet.id}`, data)
            .then(
              (response) => {
                resolve(response.data);
              }
            );
        });
      }
    };
  }]);

  Iago.directive('iagoSnippet', function() {
    return {
      restrict: 'E',
      scope: {
        snippet: '=snippet'
      },
      templateUrl: './templates/directives/snippet.html',
      controller: ['$scope', 'SnippetsService', function($scope, SnippetsService) {
        var vm = this;

        vm.snippet    = $scope.snippet;
        vm.isExpanded = vm.snippet.title == '' && vm.snippet.content == '' ? true : false;
        vm.isEditable = vm.snippet.title == '' && vm.snippet.content == '' ? true : false;

        vm.toggleExpand = () => {
          vm.isExpanded = !vm.isExpanded;

          if(!vm.isExpanded) {
            vm.reset();
          }
        }

        vm.toggleEditable = () => {
          vm.isEditable = !vm.isEditable;
        }

        vm.reset = () => {
          vm.isEditable = false;
        };

        vm.cancel = () => {
          vm.reset();
        };

        vm.save = () => {
          const method = vm.snippet.id ? 'update' : 'create';
          SnippetsService
            [method](vm.snippet)
            .then(
              () => {
                console.log(`Snippet has been ${method}d`);
              },
              (error) => {
                console.log('Error: ', error);
              }
            );
        };
      }],
      controllerAs: '$ctrl'
    };
  });

})();

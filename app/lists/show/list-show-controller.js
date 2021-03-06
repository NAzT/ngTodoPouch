module.exports = function ($scope, $todoSvc,
  $stateParams, $state, $us, $window) {
  var get = function(id) {
    $todoSvc.$get($scope.user, id).then(function(doc) {
      $scope.$apply(function() {
        console.log(doc);
        $scope.list = doc;
      });
    });
  };

  get($stateParams.id);

  $scope.add = function (task) {
    if (!$scope.list.tasks) { $scope.list.tasks = []; }
    $scope.list.tasks.push({ description: task.description});
    $scope.task = null;
  };
  $scope.save = function(list) {
    $todoSvc.$put($scope.user, list).then(function (doc) {
      $scope.$apply(function() {
        $state.go('lists.index');
      });
    });
  };
  $scope.rmDone = function(list) {
    var isOpen = function (t) { return !t.done; }
    var result = $us.partition(list.tasks, isOpen);
    $scope.list.tasks = $us(result).first();
    if (!$scope.list.completed) { $scope.list.completed = []; }
    $scope.list.completed = $us.union(result[0], $scope.list.completed);
  };

  $scope.rmTask = function(task) {
    $scope.list.tasks = $us($scope.list.tasks).without(task);
  };

  $scope.rmList = function(list) {
    if ($window.confirm('Are you sure?')) {
      $todoSvc.$remove($scope.user, list).then(function(res) {
        $scope.$apply(function() {
          $state.go('lists.index');
        });
      });
    }
  };

  $scope.$on('database:changed', function(e, change) {
    if (change.id === $scope.list._id) {
      get(change.id);
    }
  });

};

(function (angular) {
  'use strict';

  angular
    .module('test')
    .controller('ListCtrl', ListCtrl);

  ListCtrl.$inject = [];

  function ListCtrl() {
    var vm = this;

    vm.onClick = function ($index) {
      console.log('onClick', $index);
    }
  }

})(window.angular);


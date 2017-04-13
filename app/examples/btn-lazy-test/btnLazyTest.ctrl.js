(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnLazyTestCtrl', BtnLazyTestCtrl);

    BtnLazyTestCtrl.$inject = [
        'cozenLazyLoadRandom',
        'cozenLazyLoadMemory'
    ];

    function BtnLazyTestCtrl(cozenLazyLoadRandom, cozenLazyLoadMemory) {
        var vm            = this;
        vm.leftCol1       = '30px';
        vm.defaultHeight  = 60;
        vm.espaceHeight   = 45;
        vm.lazyTestValues = [
            {
                name   : 'Random LastName',
                onClick: cozenLazyLoadRandom.getRandomLastName
            },
            {
                name   : 'Random FirstName',
                onClick: cozenLazyLoadRandom.getRandomFirstName
            },
            {
                name   : 'Random Email',
                onClick: cozenLazyLoadRandom.getRandomEmail
            },
            {
                name   : 'Random LastName (nationality: it)',
                onClick: cozenLazyLoadRandom.getRandomLastName,
                param1 : 'it'
            },
            {
                name   : 'Random FirstName (gender: male)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'male'
            },
            {
                name   : 'Random FirstName (gender: male, nationality: it)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'male',
                param2 : 'it'
            },
            {
                name   : 'Random FirstName (gender: female)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'female'
            },
            {
                name   : 'Random FirstName (gender: female, nationality: it)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'female',
                param2 : 'it'
            },
            {
                name   : 'Random Email (domain: test.com)',
                onClick: cozenLazyLoadRandom.getRandomEmail,
                param1 : 'test.com'
            },
            {
                name   : 'Random Domain',
                onClick: cozenLazyLoadRandom.getRandomDomain
            },
            {
                name   : 'Memory Email',
                onClick: cozenLazyLoadMemory.getEmail
            }
        ]
    }

})(window.angular);


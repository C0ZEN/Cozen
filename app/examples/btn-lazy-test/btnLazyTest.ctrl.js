(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnLazyTestCtrl', BtnLazyTestCtrl);

    BtnLazyTestCtrl.$inject = [
        'cozenLazyLoadRandom',
        'cozenLazyLoadMemory',
        'cozenLazyLoadPreBuild'
    ];

    function BtnLazyTestCtrl(cozenLazyLoadRandom, cozenLazyLoadMemory, cozenLazyLoadPreBuild) {
        var vm                   = this;
        vm.leftCol1              = '30px';
        vm.leftCol2              = '300px';
        vm.defaultHeight         = 60;
        vm.espaceHeight          = 45;
        vm.cozenLazyLoadPreBuild = cozenLazyLoadPreBuild;
        vm.lazyTestValuesCol1    = [
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
                name   : 'Random LastName (it)',
                onClick: cozenLazyLoadRandom.getRandomLastName,
                param1 : 'it'
            },
            {
                name   : 'Random FirstName (male)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'male'
            },
            {
                name   : 'Random FirstName (male, it)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'male',
                param2 : 'it'
            },
            {
                name   : 'Random FirstName (female)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'female'
            },
            {
                name   : 'Random FirstName (female, it)',
                onClick: cozenLazyLoadRandom.getRandomFirstName,
                param1 : 'female',
                param2 : 'it'
            },
            {
                name   : 'Random Email (test.com)',
                onClick: cozenLazyLoadRandom.getRandomEmail,
                param1 : 'test.com'
            },
            {
                name   : 'Random Domain',
                onClick: cozenLazyLoadRandom.getRandomDomain
            },
            {
                name   : 'Memory Email',
                onClick: cozenLazyLoadMemory.getMemoryEmail
            },
            {
                name   : 'PreBuild Simple User (male, en)',
                onClick: cozenLazyLoadPreBuild.getPreBuildSimpleUser,
                param1 : 'male',
                param2 : 'en'
            },
            {
                name   : 'PreBuild Simple User (female, it)',
                onClick: cozenLazyLoadPreBuild.getPreBuildSimpleUser,
                param1 : 'female',
                param2 : 'it'
            },
            {
                name   : 'Random Birthday',
                onClick: cozenLazyLoadRandom.getRandomBirthday
            },
            {
                name   : 'Random Birthday (true)',
                onClick: cozenLazyLoadRandom.getRandomBirthday,
                param1 : true
            },
            {
                name   : 'Random Birthday (false, true)',
                onClick: cozenLazyLoadRandom.getRandomBirthday,
                param1 : false,
                param2 : true
            },
            {
                name   : 'Random Sentence',
                onClick: cozenLazyLoadRandom.getRandomSentence
            },
            {
                name   : 'Random Sentence (5 words)',
                onClick: cozenLazyLoadRandom.getRandomSentence,
                param1 : 5
            },
            {
                name   : 'Random Sentence (1 at 5 words)',
                onClick: cozenLazyLoadRandom.getRandomSentence,
                param1 : null,
                param2 : 1,
                param3 : 5
            }
        ];
        vm.lazyTestValuesCol2    = [];
        vm.fillForm              = function () {
            var simpleUser = cozenLazyLoadPreBuild.getPreBuildSimpleUser('test');
            vm.firstName   = simpleUser.firstName;
            vm.lastName    = simpleUser.lastName;
        }
    }

})(window.angular);


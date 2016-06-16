/*
 * Nome del file: homePageTeacher.js
 * Percorso: public/home/homePageTeacher.js
 * Autore: Vault-Tech
 * Data creazione:
 * E-mail: vaulttech.swe@gmail.com
 *
 *  Controller per la visualizzazione della homepage docente
 *
 * * Diario delle modifiche:
 *
 */

angular.module('Quizzipedia').directive('homePageAdmin', function() {
    return {
        restrict: 'E',
        templateUrl: './public/home/homepageAdmin.html',
        controller: function($scope, $http) {
            
            $scope.comunications = [];
            
            $scope.loadComunications = function () {                
                $http.get('/api/admin/fetch_comunications').success (function (response) {
                    $scope.comunications = response;
                });
            }
            
            $scope.loadComunications();

        }
    };    
    
});
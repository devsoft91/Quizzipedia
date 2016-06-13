angular.module('RecoverPswd').controller('CtrlRecover',['$scope','$http','$window',function($scope,$http,$window){
    
    $scope.email = null;
    $scope.message = null;

    $scope.sendRequest = function (){

    	var value = {
    		email: $scope.email
    	}

    	$http.post('/api/auth/recover_pswd', value).success(function(response){
    			if(response.code == 0)
    				$window.location.href = '/Quizzipedia/signin_with_token';
    			else{
    				console.log(response.message);
    				console.log(response.code);
    				$scope.message = response.message;
    				alert($scope.message);
    			}
    			}).error(function(response){
              alert("Errore");
          });
    };
}]);
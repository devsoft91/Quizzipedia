angular.module().controller('CtrlQuestionStatistics',['$scope','$http','QuestionStatistics','GenericQuestion','Teacher',function($scope,$http,QuestionStatistics,GenericQuestion,Teacher){ //GenericQuestion serve per usare i metodo get per le info delle domande
    
    $scope.questionStatistics = []; //QuestionStatistics
    $scope.loadQuestion = function(){
      //chiedo al server di inviarmi tutte le domande create da questo teacher e mi restituisce un QuestionStatistics[] e lo assegno a $scope.questionStatistics  
    };
    
    
}]);
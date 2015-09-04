var depWitApp = angular.module('depWit', []);


depWitApp.controller('AmountCtrl', ['$scope', function($scope) {
  
        $scope.amount = 0.00;
        
        $scope.add = function(bal,val,action) { 
            
            if(val){
                if(!isNaN(parseFloat(bal)) && !isNaN(parseFloat(val))){
                    if(parseFloat(val) >= 0 && action.toString() === "depo"){
                        return (parseFloat(bal) + parseFloat(val)).toFixed(2);
                    }else if(parseFloat(val) >= 0 && action.toString() === "with"){
                        return (parseFloat(bal) - parseFloat(val)).toFixed(2);
                    }
                    
                    return "Error: Invalid Input";  
                }else{
                     return "Error: Invalid Input";
                }
            }
            return parseFloat(bal).toFixed(2);
           
           
        };
}]);
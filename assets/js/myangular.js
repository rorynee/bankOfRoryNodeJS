var depWitApp = angular.module('depWit', []);


depWitApp.controller('AmountCtrl', ['$scope', function($scope) {
  
        $scope.amount = 0.00;
        
        $scope.add = function(bal,val) { 
            
            if(val){
                if(!isNaN(parseFloat(bal)) && !isNaN(parseFloat(val))){
                    if(parseFloat(val) >= 0){
                        return (parseFloat(bal) + parseFloat(val)).toFixed(2);
                    }
                    return "Error: Invalid Input";  
                }else{
                     return "Error: Invalid Input";
                }
            }
            return parseFloat(bal).toFixed(2);
           
           
        };
}]);
/*depWitApp.controller('AmountCtrl', function ($scope)
{
	$scope.data = [{
            amount: '0.00'
        }];
});*/
/*
.directive('projectedBalance', function () 
 { 
 	return { 
 		restrict: 'E',                
 		link: function (scope, element, attrs) 
 		{ 
                    console.log(scope);
                    console.log(element);
                    console.log(attrs);
                    
                    
 			element.bind('mouseenter', function () 
 			{ 
 				element[0].innerText = "Rolled Over"; 
 			}); 
 
 
 			element.bind('mouseleave', function () 
 			{ 
 				element[0].innerText = "Rolled Out"; 
 			}); 
 		} 
 	} 
});
</projected-balance>
<projected-balance balance=<%= user.balance.toFixed(2) %> >
*/

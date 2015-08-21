
// Alert function for the ticket systemLanguage
// Used to view messages and to view replys
function fullMessage(data) {
	alert(data);  
}
		
// Document ready function
$(document).ready( function () {

	// Calling the datatable using an unsorted list
	$('#data_table').DataTable(
		{
			// Disable initial sort 
			"aaSorting": []
		});
	// Calling the datatable using a sorted list 	
	$('#data_table_sort').DataTable();
	
} );


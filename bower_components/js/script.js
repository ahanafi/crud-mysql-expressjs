$(document).ready(function(){
	$("#data").DataTable();
});

function konfirmasi(){
	if(confirm("Do you realy want to delete this data ?") === true){
		return true;
	} else {
		return false;
	}
}

function kembali(){
	return window.history.back();
}
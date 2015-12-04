Images = new FS.Collection("images",{
	stores:[new FS.Store.FileSystem("images",{path:"pictures"})],
	filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});

Images.deny({
 insert: function(){
	 return false;
 },
 update: function(){
	 return false;
 },
 remove: function(){
	 return false;
 },
 download: function(){
	 return false;
 }
});

Images.allow({
 insert: function(){
	 return true;
 },
 update: function(){
	 return true;
 },
 remove: function(){
	 return true;
 },
 download: function(){
	 return true;
 }
});

Template.photoCrop.events({
	'click #submitPic':function(event,template){
		event.preventDefault();

		var file = $('#uploaded').get(0).files[0]; 
		var fsFile = new FS.File(file);

		var textareaText = $('#text').val()

		fsFile.metadata = {
			post:textareaText,
			likes:0,
			userId:Meteor.userId(),
			username:Meteor.user().username
		};
		
		if ($('#uploaded').get(0).files.length === 0) {
		    alert("No files selected.");
		}

		else if(corrupted){
			alert('Your file is either corrupted or not an image.');
		}

		else{
			Images.insert(fsFile,function(error,fileObject){
				if(error){
					alert('error');
					return;
				}
			});

			Router.go('/');
		}
	},
	'click #uploadLabel':function(event,template){
		event.preventDefault();
		template.find('#uploaded').click();
	}
});

Template.photoCrop.rendered=function(){

	corrupted = false;

	$("#uploaded").change(function(){
	    readURL(this);
	    $("#displayPic")
		    .on('load', function() { 
		    	alert("Your image has loaded correctly."); 
		    	corrupted = false;
		    })
		    .on('error', function() { 
		    	alert("File is corrupted!"); 
		    	corrupted = true;
		    });
	});

}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#displayPic').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}


Template.selectedPicture.helpers({
	'selectedPic':function(){
		return Images.find({_id:Session.get('selectedPicture')});
	}
});

Template.registerHelper("reverseComments",function(arr){
	arr.reverse();
});

// id generator
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Template.selectedPicture.rendered = function(){
	var selPic = Session.get('selectedPicture');

	if(typeof selPic === 'undefined'){
		history.go(-1);
	}

	//Session.set('previousPage',Router.current().route.getName());
}

Template.selectedPicture.events({
	'click #sel-del':function(){
		var deletePicture = confirm('Are you sure you would like to delete this photo?');
	},
	'click #sel-prof':function(){
		var _id = Session.get('selectedPicture');
		var img = Images.findOne({_id:_id});

		console.log(img.metadata.username);

		Router.go(/people/+img.metadata.username);
	},
	'click #sel-comm':function(e){
		e.preventDefault();

		$('#myModal').modal('show');
	},
	 'keypress #commentInput':function(event,template){
 		// if the enter button is pressed and comment input isnt empty, comment is submitted into array
 		if(event.keyCode == 13){
 			event.preventDefault();

 			var comment = event.target.value;
 			console.log(comment);

 			if(comment.length == 0){
 				return;
 			}else{
	 			Images.update(
	 				{
	 					_id:this._id
	 				} , 
	 				{
	 					$push:{
	 						"metadata.comments":
	 						{
	 							"_id":guidGenerator(),
	 							"userId":Meteor.userId(),
	 							"username":Meteor.user().username ,
	 							"comment":comment
	 						}
	 					}
	 				}
	 			);
				event.target.value = "";
 			}
 		}
 	},
 	'click .fa-thumbs-o-up':function(event){
		event.preventDefault();
		
		// if the user has already likes this photo
		if(Images.find(
			{
				$and: [
					{
						_id:this._id
					}, 
					{
						"metadata.likes":
						{
							$elemMatch:
							{
								"userId":Meteor.userId()
							}
						}
					}
				]
			}
			).count() > 0){
			// offer the option to unlike it
			if(confirm("You have already liked this photo, would you like to unlike this photo?")){
				Images.update({_id:this._id}, {$pull:{"metadata.likes":{"userId":Meteor.userId()}}});
			}else{
				return false; // if they say no do nothing
			}
		}else{
			// if they havent liked the photo, like it
			Images.update({_id:this._id}, {$push:{"metadata.likes":{"userId":Meteor.userId()}}});
		}
	},
	'click .fa-pencil-square-o':function(event,template){
		event.preventDefault();

		var username = event.target.getAttribute('username');
		var userId = event.target.getAttribute('userId');
		var comment = event.target.getAttribute('currentComment');
		var commentId = event.target.getAttribute('commentId');
		var imageId = event.target.getAttribute('currentId');
		var ownersUserId = event.target.getAttribute('ownersUserId');

		if(Meteor.userId() === userId || Meteor.userId() === ownersUserId || Meteor.user().profile.type === 'admin'){
			if(confirm("Would you like to delete this comment?")){
				Images.update(
					{
						_id:imageId
					} , 
					{
						$pull:
						{
							"metadata.comments":
							{
								"_id":commentId,
								"userId":userId,
								"username":username, 
								"comment":comment
							}
						}
					}
				);
			}else{
				if(Meteor.userId() == userId){
					if(confirm("Would you like to edit this comment?")){
						var edit = prompt("Your comment:",comment);
						Meteor.call('editComment',imageId,userId,username,comment,commentId,edit);
					}
				}
			} 
		}
	}
});





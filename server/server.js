Meteor.methods({
	editComment:function(id,userId,username,comment,commentId,edit){
		Images.update(
			{
				_id:id,
				"metadata.comments._id":commentId
			},
			{
				$set:
				{
					"metadata.comments.$":
					{
						"_id":commentId,
						"userId":userId,
						"username":username,
						"comment":edit
					}
				}
			}
		);
	}
});
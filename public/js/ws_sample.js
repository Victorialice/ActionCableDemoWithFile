
$(function () {

		App.sample = App.cable.subscriptions.create({
				channel: "SampleChannel",
				user_id: $("#drift_boat").data('user-id')
		}, {
				connected: function() {},
				disconnected: function() {},
				received: function(data) {
						// console.log(data["num"] === 1);
						// alert(data["num"]);
						console.log(data);
						return $("span#drift_boat").append(data["drift_user"]);
				},
				test: function(group_id, user_id) {
						return this.perform('test', {
																group_id: group_id,
																user_id: user_id
															 });
				}
		});


		$("#magic_start").click(function()
														{
																// console.log("jsjss");
																group_id = $("#drift_boat").data("group-id");
																user_id = $("#drift_boat").data("user-id");
																App.sample.test(group_id, user_id);
														}
													 )
})

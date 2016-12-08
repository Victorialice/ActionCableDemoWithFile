function sleep(d){
		for(var t = Date.now();Date.now() - t <= d;);
}

function elapsedTime(){
    var now = new Date();
    $("#elapsed").html("sec:" +  parseInt(now.getTime() - start.getTime()) / 1000);
}


$(function () {

		App.drift = App.cable.subscriptions.create({
				channel: "DriftChannel",
				user_id: $("#drift_boat").data('user-id')
		}, {
				connected: function() {},
				disconnected: function() {},
				received: function(data) {
						// console.log(data["num"] === 1);
						// alert(data["num"]);
						if(data["num"] == 1){
								return $("ul#drift_avatars").append(data["drift_user"]);
						}else{
								$("ul#drift_avatars").empty().append(data["drift_user"])
						}
				},
				move: function(group_id, user_id, drift_num) {
						return this.perform('move', {
								users_count: users_count,
								user_id: user_id,
								drift_num: drift_num
						});
				}
		});


		$("#magic_start").click(function()
														{
																// console.log("jsjss");
																start = new Date();
																timer = setInterval(elapsedTime, 100);
																users_count = $("#drift_boat").data("users-count");
																group_id = $("#drift_boat").data("group-id");
																user_id = $("#drift_boat").data("user-id");

																for (x = j = 1; j < users_count; x = ++j) {
																		// console.log(x);
																		sleep(1000);
																		App.drift.move(users_count, user_id, x);
																		// App.drift.move("group_id", "user_id", "x");
																		// console.log("done");
																}

																// App.drift.move("group_id", "user_id", "x");
																
														}
													 )
})

function getCookie(name)
{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
				return unescape(arr[2]);
		else
				return null;
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
						// console.log(data.data.status);
						return $("span#" + data.data.status).append(JSON.stringify(data.data));
				},

				move: function(socket_name, args) {
						return this.perform('move', {
								socket_name: socket_name,
								args: args
						});
				}
		});


		$("a#user_network").click(function()
															{
																	// console.log("jsjss");
																	group_id = $("#drift_boat").data("group-id");
																	user_id = $("#drift_boat").data("user-id");
																	network = Math.floor(Math.random()*10);
																	App.drift.move("user_network", [group_id, user_id, network]);
																	return false;
															}
														 )

    $("a#user_upload_close").click(function()
																	 {
																			 // console.log("jsjss");
																			 group_id = $("#drift_boat").data("group-id");
																			 App.drift.move("user_upload_close", [group_id]);
																			 return false;
																	 }
																	)

    $("a#user_turn").click(function()
													 {
															 group_id = $("#drift_boat").data("group-id");
															 user_id = $("#drift_boat").data("user-id");
															 App.drift.move("user_turn", [group_id, user_id]);
															 return false;
													 }
													)

    $("a#user_turn_reset").click(function()
																 {
																		 group_id = $("#drift_boat").data("group-id");
																		 // user_id = $("#drift_boat").data("user-id");
																		 App.drift.move("user_turn_reset", [group_id]);
																		 return false;
																 }
																)

    $("a#loading_start").click(function()
															 {
																	 group_id = $("#drift_boat").data("group-id");
																	 total_ms = 6000;
																	 update_ms = 1000;
																	 replay = true;
																	 App.drift.move("loading_start", [group_id, total_ms, update_ms, replay]);
																	 return false;
															 }
															)

    $("a#user_download_success").click(function()
																			 {
																					 group_id = $("#drift_boat").data("group-id");
																					 user_id = $("#drift_boat").data("user-id");
																					 App.drift.move("user_download_success", [group_id, user_id]);
																					 return false;
																			 }
																			)
		$("a#animation_start").click(function()
																			 {
																					 group_id = $("#drift_boat").data("group-id");
																					 user_id = $("#drift_boat").data("user-id");
																					 App.drift.move("animation_start", [group_id, user_id]);
																					 return false;
																			 }
																)
		
		$("a#share_ok").click(function()
																			 {
																					 group_id = $("#drift_boat").data("group-id");
																					 user_id = $("#drift_boat").data("user-id");
																					 App.drift.move("share_ok", [group_id, user_id, 1]);
																					 return false;
																			 }
																			)
})

# App.drift = App.cable.subscriptions.create "DriftChannel",
#   connected: ->
#     # Called when the subscription is ready for use on the server

#   disconnected: ->
#     # Called when the subscription has been terminated by the server

#   received: (data) ->
#     # Called when there's incoming data on the websocket for this channel

#   move: (group_id, user_id, drift_num) ->
#     @perform 'move', group_id: group_id, user_id: user_id, drift_num: drift_num


# users_count = $("#drift_boat").data("users-count")
# group_id = $("#drift_boat").data("group-id")
# user_id = $("#drift_boat").data("user-id")

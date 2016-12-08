jQuery(document).on 'turbolinks:load', ->
  if document.getElementById("avatars")
    App.avatar = App.cable.subscriptions.create {
      channel: "AvatarChannel"
      group_id: $("#avatars").data('group-id') 
    },
    connected: ->
      # Called when the subscription is ready for use on the server

    disconnected: ->
      # Called when the subscription has been terminated by the server

    received: (data) ->
      $("#avatars ul").append data["user"]
      # Called when there's incoming data on the websocket for this channel

    upload: (avatar, group_id) ->
      console.log("upload")
      @perform 'upload', avatar: avatar, group_id: group_id

    # $('#new_user').submit (e) ->
    #   # alert("asdf")
    #   $this = $(this)
    #   xhr = new XMLHttpRequest()
    #   xhr.open("POST", $("#new_user").attr("action"), true);
    #   formData = new FormData();
    #   file = $('#user_avatar').prop('files')[0]
    #   formData.append("avatar", file)
    #   formData.append("group_id", $("#avatars").data('group-id'))
    #   re = xhr.send(formData);
    #   console.log("reuslt")
    #   console.log(re)
    #   # App.avatar.upload $("#avatars").data('group-id')
    #   e.preventDefault()
    #   return false

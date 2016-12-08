function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

$(function () {

  App.sample = App.cable.subscriptions.create({
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
  user_upload_success: function(group_id, user_id) {
    return this.perform('user_upload_success', {
      group_id: group_id,
    user_id: user_id

    });
  },
  user_network: function(group_id, user_id, network) {
    return this.perform('user_network', {
      group_id: group_id,
    user_id: user_id,
    network: network
    });
  },
  user_upload_close: function(group_id) {
    return this.perform('user_upload_close', {
      group_id: group_id
    });
  },
  user_turn: function(group_id, user_id) {
    return this.perform('user_turn', {
      group_id: group_id,
    user_id: user_id
    });
  },
  user_turn_reset: function(group_id, user_id) {
    return this.perform('user_turn_reset', {
      group_id: group_id,
    user_id: user_id
    });
  },
  loading_start: function(group_id, total_ms, update_ms, replay) {
    return this.perform('loading_start', {
      group_id: group_id,
    total_ms: total_ms,
    update_ms: update_ms,
    replay: replay
    });
  },

  user_download_success: function(group_id, user_id) {
    return this.perform('user_download_success', {
      group_id: group_id,
    user_id: user_id
    });
  }



  });


  $("a#user_network").click(function()
      {
        // console.log("jsjss");
        group_id = $("#drift_boat").data("group-id");
        user_id = $("#drift_boat").data("user-id");
        network = 4;
        App.sample.user_network(group_id, user_id, network);
        return false;
      }
      )

    $("a#user_upload_close").click(function()
        {
          // console.log("jsjss");
          group_id = $("#drift_boat").data("group-id");
          App.sample.user_upload_close(group_id);
          return false;
        }
        )

    $("a#user_turn").click(function()
        {
          group_id = $("#drift_boat").data("group-id");
          user_id = $("#drift_boat").data("user-id");
          App.sample.user_turn(group_id, user_id);
          return false;
        }
        )

    $("a#user_turn_reset").click(function()
        {
          group_id = $("#drift_boat").data("group-id");
          user_id = $("#drift_boat").data("user-id");
          App.sample.user_turn_reset(group_id, user_id);
          return false;
        }
        )

    $("a#loading_start").click(function()
        {
          group_id = $("#drift_boat").data("group-id");
          total_ms = 3000;
          update_ms = 200;
          replay = true;
          App.sample.loading_start(group_id, total_ms, update_ms, replay);
          return false;
        }
        )

    $("a#user_download_success").click(function()
        {
          group_id = $("#drift_boat").data("group-id");
          user_id = $("#drift_boat").data("user-id");
          App.sample.user_download_success(group_id, user_id);
          return false;
        }
        )

})

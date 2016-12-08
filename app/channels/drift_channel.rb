# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class DriftChannel < ApplicationCable::Channel
  def subscribed
    # puts "****** subscribed ***********"
    $r.zadd("DriftChannel.connected_user_ids",
            Time.now.to_i,
            params[:user_id]
           )
    stream_from "drift_channel_#{params[:user_id]}"
  end

  def unsubscribed
    $r.zrem("DriftChannel.connected_user_ids",
            params[:user_id]
           )
    # puts "****** unsubscribed ***********"
    # puts params.inspect
    # ****** unsubscribed ***********
    # {"channel"=>"DriftChannel", "user_id"=>71}
    # Any cleanup needed when channel is unsubscribed
  end

  def move(data)
    case data["socket_name"]
    when "user_network"
      # App.drift.move("user_network", [group_id, user_id, network]);
      Broadcast.user_network(data["args"][0], data["args"][1], data["args"][2])
    when "user_upload_close"
      # App.drift.move("user_upload_close", [group_id]);
      Broadcast.user_upload_close(data["args"][0])
    when "user_turn"
      # App.drift.move("user_turn", [group_id, user_id]);
      Broadcast.user_turn(data["args"][0], data["args"][1])
    when "user_turn_reset"
      # App.drift.move("user_turn_reset", [group_id]);
      Broadcast.user_turn_reset(data["args"][0])
    when "loading_start"
      # App.drift.move("loading_start", [group_id, total_ms, update_ms, replay]);
      Broadcast.loading_start(data["args"][0], data["args"][1], data["args"][2], data["args"][3])
    when "user_download_success"
      # App.drift.move("user_download_success", [group_id, user_id]);
      Broadcast.user_download_success(data["args"][0], data["args"][1])
    when "animation_start"
			# App.drift.move("loading_start", [group_id, user_id]);
      Broadcast.animation_start(data["args"][0], data["args"][1])
    when "share_ok"
      # App.drift.move("share_ok", [group_id, user_id, type]);
      Broadcast.share_ok(data["args"][0], data["args"][1], data["args"][2])
    end
  end

  def user_network(data)
    Broadcast.user_network(data["group_id"], data["user_id"], data["network"])
  end

  def user_upload_close(data)
    Broadcast.user_upload_close(data["group_id"])
  end

  def user_turn(data)
    Broadcast.user_turn(data["group_id"], data["user_id"])
  end

  def user_turn_reset(data)
    Broadcast.user_turn_reset(data["group_id"], data["user_id"])
  end

  def loading_start(data)
    Broadcast.loading_start(data["group_id"], data["total_ms"], data["update_ms"], data["replay"])
  end

  def user_download_success(data)
    Broadcast.user_download_success(data["group_id"], data["user_id"])
  end

end

# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class SampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sample_channel_#{params[:user_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def test(data)
    # puts data.inspect
    user_id = data["user_id"]
    group_id = data["group_id"]
    ActionCable.server.broadcast "sample_channel_#{data['user_id']}", drift_user: "<p>network: #{rand(10)} " + "user_id: #{user_id}  group_id: #{group_id}" + "</p>"
  end
end

# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class AvatarChannel < ApplicationCable::Channel
  def subscribed
    stream_from "avatar_channel_#{params[:group_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  # def upload(data)
  #   puts "******** Avatar_Channel Asdfasdf"
  #   puts data["avatar"].class
  #   puts data.inspect
  #   team = Team.find_by_group_id(data["group_id"])
  #   User.create(
  #     avatar: data["avatar"],
  #     group_id: data["group_id"],
  #     team: team
  #   )
  # end
end

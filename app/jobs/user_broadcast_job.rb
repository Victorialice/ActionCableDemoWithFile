class UserBroadcastJob < ApplicationJob
  queue_as :default

  def perform(user)
    unless user.num == 1
    ActionCable.server.broadcast "avatar_channel_#{user.group_id}",
                                 user: render_user(user)
    end
  end

  def render_user(user)
    UsersController.render partial: 'users/user', locals: {user: user}
  end
end

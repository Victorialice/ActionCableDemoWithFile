# class User < ApplicationRecord
#   
#   # belongs_to :team
#   # after_create_commit { UserBroadcastJob.perform_later(self) }
#   mount_uploader :avatar, AvatarUploader
#
#
#   def move(users_count, drift_num)
#     users = Team.find_by(group_id: self.group_id).users
#     users.each do |user|
#       user.drift(users_count, drift_num)
#     end
#   end
#
#   def drift(users_count, drift_num)
#     if self.num + drift_num == users_count + 1
#       ActionCable.server.broadcast "drift_channel_#{self.id}", drift_avatar: ""
#     end
#     
#     unless self.num + drift_num > users_count
#       user = User.find_by(group_id: group_id, num: self.num + drift_num)
#       ActionCable.server.broadcast "drift_channel_#{self.id}", num: self.num, drift_user: render_drift_avatar(user)
#     end
#   end
#
#   def render_drift_avatar(user)
#     UsersController.render partial: 'users/drift_user', locals: {user: user}
#   end
#
# end

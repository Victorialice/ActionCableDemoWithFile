class Broadcast
  
  class << self
    # WS => leader
    def user_upload_success(leader_id, user_id)
      ActionCable.server.broadcast "drift_channel_#{leader_id}", data: {
                                     status: "user_upload_success",
                                     uid: user_id
                                   }
    end

    def user_network(group_id, user_id, network)
      Agent.create_network(group_id, user_id, network)
      # ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
      #                                status: "user_network",
      #                                network: network
      #                              }
    end

    def user_upload_close(group_id)
      Agent.user_upload_close(group_id)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      if user_ids.size > 1
        user_ids.each do |user_id|
          Broadcast.user_upload_close_success(user_id)
        end
      else
        user_ids.each do |user_id|
          Broadcast.user_upload_close_failure(user_id)
        end
      end
    end

    def user_upload_close_success(user_id)
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "user_upload_close_success"
                                   }
    end

    def user_upload_close_failure(user_id)
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "user_upload_close_failure",
                                     code: "600",
                                     error_code: "E00004"
                                   }
    end

    def user_turn(group_id, user_id)
      turn_id = Agent.user_turn(group_id, user_id)
      turned_user_ids = $r.zrange("group.turned_users:#{group_id}", 0, -1)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      if !turned_user_ids.include? user_id
        $r.zadd("group.turned_users:#{group_id}",
                turn_id,
                user_id
               )
      end
      user_turn_success(group_id, user_id, turn_id)
      turned_user_ids = $r.zrange("group.turned_users:#{group_id}", 0, -1)
      if turned_user_ids.size == user_ids.size
        #notice leader: user_ids.first
        user_turn_success(group_id, user_ids.first, turn_id)
      end
    end

    def user_turn_success(group_id, user_id, turn_id)
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "user_turn_success",
                                     message: "success",
                                     turn_id: turn_id
                                   }
    end

    def user_turn_reset(group_id)
      Agent.user_turn_reset(group_id)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      user_ids.each do |user_id|
        user_turn_reset_success(user_id)
      end
    end

    def user_turn_reset_success(user_id)
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "user_turn_reset_success"
                                   }
     end

    def loading_start(group_id, total_ms, update_ms, replay)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      if user_ids.size > 1
        group = Agent.assign_total_ms_and_update_ms_for_group(group_id, total_ms, update_ms)
        turned_user_ids = $r.zrange("group.turned_users:#{group_id}", 0, -1)
        message_id = group["message_id"]
        network = $r.hgetall("network_for_group:#{group_id}").values.min()
        user_ids.each do |user_id|
          # network = $r.hgetall("network_for_group:#{group_id}")[user_id]
          Broadcast.loading_start_success(user_id, network, message_id, replay, turned_user_ids)
        end
      else
        user_ids.each do |user_id|
          ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                         status: "loading_start_failure",
                                         code: "600",
                                         error_code: "E00004"
                                       }
        end
      end
    end

    def loading_start_success(user_id, network, message_id, replay, users_id)
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "loading_start_success",
                                     network: network,
                                     message_id: message_id,
                                     users_id: users_id,
                                     replay: replay
                                   }
    end

    def user_download_success(group_id, user_id) # TODO
      downloaded_user_ids = $r.zrange("group.downloaded_users:#{group_id}", 0, -1)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      if !downloaded_user_ids.include? user_id
        $r.zadd("group.downloaded_users:#{group_id}",
                Time.now.to_i,
                user_id
               )
      end
      downloaded_user_ids = $r.zrange("group.downloaded_users:#{group_id}", 0, -1)
      if downloaded_user_ids.size == user_ids.size
        animation_start(group_id)
        $r.del("group.downloaded_users:#{group_id}")
      end
    end

    def animation_start(group_id)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      group = Agent.get_group_by_group_id(group_id)
      
      user_ids.each do |user_id|
        ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                       status: "animation_start"
                                     }
      end
      update_ms = group["update_ms"] #mili second
      total_ms  = group["total_ms"] #mili second
      n = 0
      now = Time.now
      while n < total_ms.to_i/update_ms.to_i
        elapsed = '%.2f' % ((Time.now - now)*1000)
        user_ids.each do |user_id|
          animation_update(user_id, elapsed)
        end
        n = n + 1
        sleep update_ms.to_i/1000
      end
    end

    def animation_update(user_id, elapsed) #elapsed: mili second
      ActionCable.server.broadcast "drift_channel_#{user_id}", data: {
                                     status: "animation_update",
                                     elapsed: elapsed
                                   }
    end

    def share_ok(group_id, user_id, type_id) #TODO
      # WechatAPI image info
      share_ok_success(group_id, user_id, type_id)
    end

    def share_ok_success(group_id, user_id, type_id)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      user_ids.each do |u_id|
        ActionCable.server.broadcast "drift_channel_#{u_id}", data: {
                                       status: "share_ok_success",
                                       type: type_id
                                     }
      end
    end
  end # class << self
  
end

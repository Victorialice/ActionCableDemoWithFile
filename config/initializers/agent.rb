class Agent
  class << self

    def create_user(group_id, turn_id)
      id = $r.incr("users.count")
      $r.hmset("user:#{id}",
               "id", id,
               "group_id", group_id,
               "turn_id", turn_id,
               "updated_at", Time.new.to_i,
               "created_at", Time.new.to_i)
      $r.zadd("group.users:#{group_id}",
              Time.now.to_i,
              id
             )
      if turn_id == 1
        $r.zadd("group.turned_users:#{group_id}",
                turn_id,
                id
               )
      end
      id
    end

    def create_group(group_id)
      id = $r.incr("groups.count")
      $r.hmset("group:#{id}",
               "id", id,
               "group_id", group_id,
               "updated_at", Time.new.to_i,
               "created_at", Time.new.to_i
              )
      $r.set("group_id.to.id:#{group_id}", id)
      group_id
    end

    # Return the user from the ID.
    def get_user_by_id(id)
      $r.hgetall("user:#{id}")
    end

    # Return the user from the ID.
    def get_group_by_id(id)
      $r.hgetall("group:#{id}")
    end

    # Return the group from the group_id.
    def get_group_by_group_id(group_id)
      id = $r.get("group_id.to.id:#{group_id}")
      return nil if !id
      get_group_by_id(id)
    end

    def assign_message_id_for_group(group_id, message_id)
      group = get_group_by_group_id(group_id)
      id = group["id"]
      $r.hmset("group:#{id}",
               "message_id", message_id,
               "updated_at", Time.new.to_i
              )
    end
    
    def assign_total_ms_and_update_ms_for_group(group_id, total_ms, update_ms)
      group = get_group_by_group_id(group_id)
      id = group["id"]
      $r.hmset("group:#{id}",
               "total_ms", total_ms,
               "update_ms", update_ms,
               "updated_at", Time.new.to_i
              )
      group
    end


    def create_network(group_id, user_id, network)
      $r.hmset("network_for_group:#{group_id}",
               user_id, network
              )
    end

    def user_upload_close(group_id)
      group = get_group_by_group_id(group_id)
      id = group["id"]
      $r.hmset("group:#{id}",
               "user_upload_close", true,
               "updated_at", Time.new.to_i
              )
      # user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      # user_ids.each do |user_id|
      #   Broadcast.user_upload_close_success(user_id)
      # end
    end

    def user_turn(group_id, user_id)
      user = get_user_by_id(user_id)
      if user["turn_id"].blank?
        turn_id = $r.incr("group.user_turn:#{group_id}")
        turn_id = $r.incr("group.user_turn:#{group_id}")      if turn_id == 1
        $r.hmset("user:#{user_id}",
                 "turn_id", turn_id)
      else
        turn_id = user["turn_id"]
      end
      turn_id
    end

    def user_turn_reset(group_id)
      $r.set("group.user_turn:#{group_id}", 0)
      $r.zremrangebyrank("group.turned_users:#{group_id}", 1, -1)
      user_ids = $r.zrange("group.users:#{group_id}", 0, -1)
      user_ids.each do |user_id|
        user = get_user_by_id(user_id)
        unless user["turn_id"] == 1
          $r.hmset("user:#{user_id}",
                   "turn_id", nil)
        end
      end #each
      # $r.get("group.user_turn:#{group_id}")
    end
    
  end
end

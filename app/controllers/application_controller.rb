class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

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
             "message_id", params[:message_id],
             "updated_at", Time.new.to_i
            )
  end
end

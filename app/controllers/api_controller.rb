# coding: utf-8

class ApiController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def check_connection
    count = $r.zcard("DriftChannel.connected_user_ids")
    if count >= MAXIMUM_CONNECTION
      render json: {
               code: "600",
               error_code: "E00001"
             }
    else
      render json: {
               "connections": count
             }
    end
  end

  def get_gid
    render json: {
             code: "600",
             error_code: "E00000"
           }
  end
  
  def uploads
    if params[:file].present? && params[:user].present?
      case params[:user]
      when "1"
        group_id = Group.make_group_id(8)
        Agent.create_group(group_id)
        user_id = Agent.create_user(group_id, turn_id=1)

        dirname = "#{Rails.root}/public/uploads/#{group_id}/#{user_id}" 
        FileUtils.mkdir_p(dirname) unless File.exist?(dirname)
        filename = "original.jpg"
        file_path = "#{dirname}/#{filename}"
        
        File.open(file_path, 'wb') do|f|
          f.write(Base64.decode64(params[:file]))
        end
        render json: {
                 message: "success",
                 gid: group_id,
                 qrHtml: RQRCode::QRCode.new( "#{HOST_URL}/member.html?gid=#{group_id}", :size => 4, :level => :m ).as_html,
                 uid: user_id
               }
      when "2"
        user_ids = $r.zrange("group.users:#{params[:gid]}", 0, -1)
        group = Agent.get_group_by_group_id(params[:gid])
        if (user_ids.size >= 8 && !group["user_upload_close"])
          render json: {
                   code: "600",
                   error_code: "E00002"
                 }
        elsif group["user_upload_close"]
          render json: {
                   code: "600",
                   error_code: "E00003"
                 }
        else
          group_id = params[:gid]
          user_id = Agent.create_user(params[:gid], turn_id = nil)
          leader_user_id = $r.zrange("group.users:#{group_id}", 0, -1).first
          
          dirname = "#{Rails.root}/public/uploads/#{group_id}/#{user_id}" 
          FileUtils.mkdir_p(dirname) unless File.exist?(dirname)
          filename = "original.jpg"
          file_path = "#{dirname}/#{filename}"
          
          File.open(file_path, 'wb') do|f|
            f.write(Base64.decode64(params[:file]))
          end

          ## user_upload_success
          ActionCable.server.broadcast "drift_channel_#{leader_user_id}", data: {
                                         status: "user_upload_success",
                                         uid: user_id
                                       }
          
          render json: {
                   message: "success",
                   gid: group_id,
                   qrHtml: RQRCode::QRCode.new( "#{HOST_URL}/member.html?gid=#{group_id}", :size => 4, :level => :m ).as_html,
                   uid: user_id
                 }
        end
      when "3"
        # WeChatAPI.share
        group_id = params[:gid]
        
        dirname = "#{Rails.root}/public/uploads/#{group_id}/share" 
        FileUtils.mkdir_p(dirname) unless File.exist?(dirname)
        filename = "original.jpg"
        file_path = "#{dirname}/#{filename}"
        
        File.open(file_path, 'wb') do|f|
          f.write(Base64.decode64(params[:file]))
        end

        render json: {
                 status: "success",
               }
      end
    else
      render json: {
               status: "error",
               message: "invalid parameter" 
             }
    end
  end

  def message
    if params[:gid].present? && params[:message_id].present?
      Agent.assign_message_id_for_group(params[:gid], params[:message_id])
      render json: {
               status: "success",
               data: {
                 "message": "success"
               }
             }
    else
      render json: {
               status: "error",
               data: {
                 "message": "parameter missing"
               }
             }
    end
  end
end


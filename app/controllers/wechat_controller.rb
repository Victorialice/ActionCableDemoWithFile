class WechatController < ApplicationController
    protect_from_forgery except: :share
  def share
    @app_id = APP_ID

    if ::Redis.current.get("access_token").blank?
      retry_counter = 0
      begin
        res = open "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{APP_ID}&secret=#{APP_SECRET}"
      rescue Errno::ECONNREFUSED
        retry_counter += 1
        if retry_counter <= 1
          retry
        end
      rescue => e
        retry_counter += 1
        if retry_counter <= 1
          retry
        end
        puts e
      end

      code, message = res.status      
      if code == '200'
        result = ActiveSupport::JSON.decode res.read
        @access_token = result["access_token"]
      else
        puts "OMG!! #{code} #{message}"
      end
      ::Redis.current.set("access_token",@access_token)
      ::Redis.current.expire("access_token",7000)
    else
      @access_token = ::Redis.current.get("access_token")
    end

    if ::Redis.current.get("jsapi_ticket").blank?
      retry_counter = 0
      begin
        res = open "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=#{@access_token}&type=jsapi"
      rescue Errno::ECONNREFUSED
        retry_counter += 1
        if retry_counter <= 1
          retry
        end
      rescue => e
        retry_counter += 1
        if retry_counter <= 1
          retry
        end
        puts e
      end

      code, message = res.status

      if code == '200'
        result = ActiveSupport::JSON.decode res.read
        @jsapi_ticket =  result["ticket"]
        ::Redis.current.set("jsapi_ticket",@jsapi_ticket)
        ::Redis.current.expire("jsapi_ticket",7000)
      end

    else
      @jsapi_ticket = ::Redis.current.get("jsapi_ticket")
    end
    url =  params[:current_url]
    @timestamp = Time.now.to_i
    @signature = Digest::SHA1.hexdigest("jsapi_ticket=#{@jsapi_ticket}&noncestr=Wm3WZYTPz0wzccnW&timestamp=#{@timestamp}&url=#{url}")
  end
end

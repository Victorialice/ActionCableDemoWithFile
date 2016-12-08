# coding: utf-8
class HomeController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def entry
    # wifi, File Server VPN
    @group_id = params[:group_id]
    @qr = RQRCode::QRCode.new( "#{HOST_URL}/start/#{@group_id}", :size => 4, :level => :m )
    @group = Team.find_by(group_id: @group_id)
  end

  def index
    @group_id = rand(999999)
    @qr = RQRCode::QRCode.new( "#{HOST_URL}/leader_start/#{@group_id}", :size => 4, :level => :m )
  end

  def leader_start
    @group_id = params[:group_id]
    @user = User.new(group_id: @group_id)
  end
  
  def start
    @group_id = params[:group_id]
    @user = User.new(group_id: @group_id)
  end

  def group
    @user = User.new
    @group_id = params[:group_id]
    @group = Team.find_by_group_id @group_id
  end

  def leader_upload
    team = Team.create(group_id: params[:user][:group_id])
    user = User.create(
      avatar: params[:user][:avatar],
      group_id: params[:user][:group_id],
      num: 1,
      team: team
    )
    team.update_attribute(:leader_id, user.id)
    redirect_to "/entry/#{params[:user][:group_id]}"
  end

  def upload
    team = Team.find_by(group_id: params[:user][:group_id])
    user = User.create(
      avatar: params[:user][:avatar],
      group_id: params[:user][:group_id],
      team: team
    )
    redirect_to "/entry_ok/#{user.group_id}/users/#{user.id}"
  end

  def entry_ok
    @user = User.find(params[:user_id])
  end
  
  def entry_complete
    @group = Team.find_by(group_id: params[:group_id])
  end
  
  def tap
    @group = Team.find_by(group_id: params[:group_id])
    @user = User.find(params[:user_id])
    if  @user.num.blank?
      numbers = @group.users.map(&:num)
      @num = numbers.compact.max+1
      @user.update_attribute(:num, @num)
    end
  end

  def get_image
    text = params[:path]
    #text = text+"_"+params[:width] if params[:width].present?
    unless params[:width].present? && params[:width] == "750"
    splitted_text = text.split(".")
    text = splitted_text[0] + "_" + params[:width] + "." + splitted_text[1]
    end
    render :text => text
  end
end

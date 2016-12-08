class ApiTestController < ApplicationController
  def index
  end

  def assign_url
    session[:assigned_url] = params[:assigned_url]
    splitted = session[:assigned_url].split("/")
    session[:group_id] = splitted[2]
    session[:user_id] = splitted[3]
    redirect_to "/api_test"
  end

  def message
  end

  def user_upload
    
  end

  def user_page
  end
end

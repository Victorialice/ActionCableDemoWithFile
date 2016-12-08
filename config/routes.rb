Rails.application.routes.draw do

  get 'wechat/share'

  get 'users/show'

  get 'home/index'
  get '/api_test', to: 'api_test#index'
  get '/group/:group_id', to: 'home#group'
  
  get '/start/:group_id', to: 'home#start'
  get '/leader_start/:group_id', to: 'home#leader_start'

  root to: 'home#index'
  post 'home/upload'
  post 'home/leader_upload'
  get '/get_image', to: 'home#get_image'
  get '/entry/:group_id', to: 'home#entry'
  get '/entry_ok/:group_id/users/:user_id', to: 'home#entry_ok'
  get '/entry_complete/:group_id', to: 'home#entry_complete'
  get '/tap/:group_id/users/:user_id', to: 'home#tap'

  namespace :api do
    get "uploads"
    get "message"
    post "uploads"
    post "message"
    get "get_gid"
    get "check_connection"
  end

  namespace :api_test do
    get "message"
    post "assign_url"
  end
  
  get '/group/:group_id/leader/:user_id/user_upload', to: 'api_test#user_upload'
  get '/group/:group_id/user/:user_id', to: 'api_test#user_page'

  
  mount ActionCable.server => '/cable'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

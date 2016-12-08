set :branch, 'master'
set :deploy_to, '/var/www/glico_rails5/production'
set :bundle_flags, "--no-binstubs"
set :log_level, :debug
# role :app, %w{119.254.114.114 119.254.114.185}
# role :web, %w{119.254.114.114 119.254.114.185}
# role :db,  %w{119.254.114.114 119.254.114.185}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets bundle  public/assets public/uploads public/projects}
#set :linked_files, %w{  puma.rb  } 

server '119.254.114.114',port: 10022, user: 'app_user', roles: %w{web app db}
server '119.254.114.185',port: 10022, user: 'app_user', roles: %w{web app db}
#  server 'glicocp.kembo88.com',port: 10022, user: 'app_user', roles: %w{web app db}



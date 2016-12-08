 rails g controller home index

 rails g channel avatar upload
 rails g channel drift move
 rails g model Team group_id:integer leader_id:integer
 rails g model User team:references group_id:integer num:integer
 rails g migration add_avatar_to_users avatar:string

 rails generate controller users show

 rails s -b 192.168.50.98

# ps aux | grep puma    # Get puma pid
# kill -s SIGUSR2 pid   # Restart puma
# kill -s SIGUSR2 2778   # Restart puma
# kill -s SIGTERM pid   # Stop puma

 http://192.168.50.98:3000//projects/glico/test/index.html?path=test5/test5_.png

 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=36&fps=10&fmin=1&fmax=20
 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=72&fps=10&fmin=1&fmax=20
 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=180&fps=10&fmin=1&fmax=20
 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=320&fps=10&fmin=1&fmax=20
 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=700&fps=10&fmin=1&fmax=20
 http://192.168.50.98:3000/projects/glico/test/?path=test1/test1_.jpg&width=750&fps=10&fmin=1&fmax=20

 http://app.can-do.jp/projects/glico/test/?path=test1/test1_.jpg&width=750&fps=10&fmin=1&fmax=600

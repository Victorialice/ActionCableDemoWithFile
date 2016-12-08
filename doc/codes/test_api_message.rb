# require "net/http"
# require "open-uri"

params = {}  
params["gid"] = "lqtsmhdd"
params["message_id"] = "2"

uri = URI.parse("http://localhost:3000/api/message")  
res = Net::HTTP.post_form(uri, params)   

if res.code == "200"
  parsed = JSON.parse(res.body)
  puts "status:"
  puts parsed["status"]
else
  puts res.code
end

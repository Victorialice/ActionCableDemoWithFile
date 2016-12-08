# require "net/http"
# require "open-uri"

file_path = File.join(Rails.root, "public", "country_road.jpg")

encoded_string = Base64.encode64(File.open(file_path, "rb").read)
params = {}  
params["user"] = 3
params["file"] = encoded_string
params["gid"] = "j284br0s"

uri = URI.parse("http://localhost:3000/api/uploads")  
res = Net::HTTP.post_form(uri, params)   

if res.code == "200"
  parsed = JSON.parse(res.body)
  puts "uid:"
  puts parsed["data"]["uid"]
  puts "gid:"
  puts parsed["data"]["gid"]
else
  puts res.code
end

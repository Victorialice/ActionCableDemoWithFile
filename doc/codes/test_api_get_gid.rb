# require "net/http"
# require "open-uri"

uri = URI.parse("http://localhost:3000/api/get_gid")
res = Net::HTTP.get(uri)

parsed = JSON.parse(res)

puts "message:"
puts parsed["message:"]

puts "gid:"
puts parsed["data"]["gid"]
puts "qrHtml:"
puts parsed["data"]["qrHtml"]

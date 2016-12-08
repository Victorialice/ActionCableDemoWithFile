require 'redis'

RedisURL = "redis://127.0.0.1:6379"

def setup_redis(uri=RedisURL)
    uri = URI.parse(uri)
    $r = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password) unless $r
end

setup_redis

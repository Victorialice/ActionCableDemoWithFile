# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.

if Rails.env == "development"
  HOST_URL = "http://localhost:3000"
  #HOST_URL = "http://192.168.50.25:3000"
else
  HOST_URL = "http://glico-qiao2016.com"
end
MAXIMUM_CONNECTION = 100

Rails.application.initialize!

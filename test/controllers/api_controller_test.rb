require 'test_helper'

class ApiControllerTest < ActionDispatch::IntegrationTest
  test "should get update" do
    get api_update_url
    assert_response :success
  end

  test "should get message" do
    get api_message_url
    assert_response :success
  end

end

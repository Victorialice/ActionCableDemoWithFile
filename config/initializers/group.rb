class Group
  
  def self.make_group_id(length)
    str = (97 + rand(25)).chr
    (length-1).times { str += (("0".."9").to_a + ("a".."z").to_a)[rand(36)] }
    str
  end
  
end

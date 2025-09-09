package com.example.My_Chat.controller;

import com.example.My_Chat.model.Friend;
import com.example.My_Chat.model.User;
import com.example.My_Chat.repository.FriendRepository;
import com.example.My_Chat.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/* Chưa hiển thị list danh sách bạn bè
chỉ hiển thị khi load lại hai lần thôi
cần làm thêm kết bạn
 */




import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/friends")
public class FriendController {
    @Autowired
    UserRepository userRepo;
    @Autowired
    FriendRepository friendRepo;

    @Transactional
    @PostMapping("/addFriend")
    public String addFriend(@RequestParam String user1, @RequestParam String user2){

        User us1 =userRepo.findByUsername(user1);
        User us2 = userRepo.findByUsername(user2);

        if(us1==null || us2 == null) return "not found";

        Friend f1 = new Friend();
        f1.setUserId(us1.getId());
        f1.setFriendId(us2.getId());
        f1.setStatus("accepted");

        Friend f2 = new Friend();
        f2.setUserId(us2.getId());
        f2.setFriendId(us1.getId());
        f2.setStatus("accepted");

        friendRepo.save(f1);
        friendRepo.save(f2);
        friendRepo.flush(); // ép Hibernate flush ngay

        return "ok";
    }

    @GetMapping("/{username}")
    public List<User> getFriends(@PathVariable String username) {
        User me = userRepo.findByUsername(username);
        if (me == null) return List.of(); // Không tìm thấy user thì trả về rỗng

        return friendRepo.findFriendsByUserId(me.getId());
    }

}

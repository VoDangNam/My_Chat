package com.example.My_Chat.controller;
import com.example.My_Chat.model.Friend;
import com.example.My_Chat.model.User;
import com.example.My_Chat.service.FriendService;
import com.example.My_Chat.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/friends")
public class FriendController {

    private final FriendService friendService;
    private final UserRepository userRepository;

    public FriendController(FriendService friendService, UserRepository userRepository) {
        this.friendService = friendService;
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String keyword) {
        return friendService.searchUsers(keyword);
    }

    @PostMapping("/sendRequest")
    public Friend sendRequest(@RequestParam String fromUser, @RequestParam String toUser) {
        User u1 = userRepository.findByUsername(fromUser);
        User u2 = userRepository.findByUsername(toUser);
        if (u1 == null || u2 == null) throw new RuntimeException("User không tồn tại!");
        return friendService.sendFriendRequest(u1.getId(), u2.getId());
    }


    @PostMapping("/acceptRequest")
    public Friend acceptRequest(@RequestParam Long requestId) {
        return friendService.acceptFriendRequest(requestId);
    }


    @GetMapping("/{username}")
    public List<User> getFriends(@PathVariable String username) {
        User me = userRepository.findByUsername(username);
        if (me == null) return List.of();
        return friendService.getFriends(me.getId());
    }

    @GetMapping("/requests/{username}")
    public List<User> getPendingRequests(@PathVariable String username) {
        User me = userRepository.findByUsername(username);
        if (me == null) return List.of();
        return friendService.getPendingRequests(me.getId());
    }
}

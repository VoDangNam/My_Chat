package com.example.My_Chat.service;

import com.example.My_Chat.model.Friend;
import com.example.My_Chat.model.User;
import com.example.My_Chat.repository.FriendRepository;
import com.example.My_Chat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    public FriendService(FriendRepository friendRepository, UserRepository userRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.findByUsernameContainingIgnoreCase(keyword);
    }


    public Friend sendFriendRequest(Long userId, Long friendId) {
        if (friendRepository.findByUserIdAndFriendId(userId, friendId) != null) {
            throw new RuntimeException("Đã gửi lời mời hoặc đã là bạn bè!");
        }
        Friend friend = new Friend();
        friend.setUserId(userId);
        friend.setFriendId(friendId);
        friend.setStatus("pending");
        return friendRepository.save(friend);
    }


    public Friend acceptFriendRequest(Long requestId) {
        Optional<Friend> request = friendRepository.findById(requestId);
        if (request.isPresent()) {
            Friend f = request.get();
            f.setStatus("accepted");
            friendRepository.save(f);

            // thêm dòng ngược lại
            if (friendRepository.findByUserIdAndFriendId(f.getFriendId(), f.getUserId()) == null) {
                Friend reverse = new Friend();
                reverse.setUserId(f.getFriendId());
                reverse.setFriendId(f.getUserId());
                reverse.setStatus("accepted");
                friendRepository.save(reverse);
            }

            return f;
        }
        throw new RuntimeException("Không tìm thấy lời mời!");
    }


    public List<User> getFriends(Long userId) {
        return friendRepository.findFriendsByUserId(userId);
    }

    public List<User> getPendingRequests(Long userId) {
        // lấy những ai gửi lời mời đến mình (status = pending)
        List<Friend> requests = friendRepository.findByFriendIdAndStatus(userId, "pending");
        return requests.stream()
                .map(f -> userRepository.findById(f.getUserId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }


}

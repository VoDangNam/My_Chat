package com.example.My_Chat.controller;

import com.example.My_Chat.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    static class LoginRequest{
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    static class LoginReponse{
        private String username;
        private String role;

        public LoginReponse(String username, String role) {
            this.username = username;
            this.role = role;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    @PostMapping("/login")
    public LoginReponse loginRepose(@RequestBody LoginRequest request){
        return userRepository.findByUsernameAndPassword(request.getUsername(),request.getPassword())
                .map(user -> new LoginReponse(user.getUsername(),user.getRole()))
                .orElseThrow(() -> new RuntimeException("Not found account"));
    }
}

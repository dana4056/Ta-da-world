package com.tada.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSockerConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // end-point 연결(/index 와 핸드쉐이크 과정을 통해 커넥션 연결), SockJS 사용
        registry.addEndpoint("/ws/room").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메세지 발행 요청의 prefix
        registry.setApplicationDestinationPrefixes("/pub");
        // 메세지 구독 요청의 prefix
        registry.enableSimpleBroker("/sub");
    }
}

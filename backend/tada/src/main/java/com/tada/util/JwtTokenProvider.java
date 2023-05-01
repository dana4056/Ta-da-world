package com.tada.util;
import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;


import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtTokenProvider {

    private String secretKey = "tada";

    // 토큰 유효시간 (분)*60*1000
    private long accessTokenTime = 2 * 60  * 60 * 1000L;
    private long refreshTokenTime = 14 * 24 * 60  * 60 * 1000L;

    @PostConstruct
    protected void init() {        // 객체 초기화 및 secretKey를 Base64로 인코딩
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public <T> String createAccessToken(String key, String data) {
        return create(key, data, "accessToken", accessTokenTime);
    }


    public <T> String createRefreshToken(String key, String data) {
        return create(key, data, "refreshToken", refreshTokenTime);
    }



    public String create(String key, String data, String subject, long expire) {
        String jwt = Jwts.builder()
                //set header : type of token, hash algorythm information setting
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("regDate", System.currentTimeMillis())//create time
                //payload setting : expiration, subject, claim etc.. information setting
                .setExpiration(new Date(System.currentTimeMillis()+expire))//token expire date
                .setSubject(subject)//ex) access-token, refresh-token
                .claim(key, data)//save data
                //signature setting : encryption by secret key
                .signWith(SignatureAlgorithm.HS256, this.generateKey())
                .compact();//serialization

        return jwt;
    }

    private byte[] generateKey(){
        byte[] key = null;
        try{
            key = secretKey.getBytes("utf-8");
        }catch(UnsupportedEncodingException e){
            e.printStackTrace();
        }
        return key;
    }


    // 토큰에서 회원 정보 추출
    public String getHostID(String token) {
        String hostId = (String) Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token).getBody().get("hostId");
        return hostId;
    }
    public String getTokenByHeader(String header){

        if(header == null || header.length() < 7) {
            return null;
        }
        return header.substring(7);
    }

    // Request의 Header에서 token 값을 가져옵니다. "X-AUTH-TOKEN" : "TOKEN값'
    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("X-AUTH-TOKEN");
    }

    // 토큰의 유효성 + 만료일자 확인
    public boolean validateToken(String jwtToken) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(jwtToken);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
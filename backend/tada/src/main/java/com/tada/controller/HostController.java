package com.tada.controller;


import com.tada.domain.dto.HostRequest;
import com.tada.domain.dto.HostResponse;
import com.tada.domain.dto.ResultDto;
import com.tada.domain.entity.Room;
import com.tada.service.HostService;
import com.tada.util.JwtTokenProvider;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {"*"}, maxAge = 6000)
@RestController
@Api(tags = "Host Controller")
@RequestMapping("/hosts")
//@Api(tags = {"회원 관리 api"})
public class HostController {

    private static final String SUCCESS = "Success";
    private static final String FAIL = "Fail";
    private static final String UNAUTHORIZED = "Token expired";
    private static final String TOKEN_ERROR = "wrong token received";
    private static final boolean TRUE = true;
    private static final boolean FALSE = false;

    @Autowired
    private HostService hostService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    public static final Logger logger = LoggerFactory.getLogger(HostController.class);

//    @ApiOperation(value = "회원가입", notes = "회원가입 요청 API", response = Map.class)
    @PostMapping("")
    @Operation(summary = "로그인", description = "소셜 로그인")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "201", description = "회원가입 후 성공"),
            @ApiResponse(responseCode = "500", description = "서버에러")
    })
    public ResponseEntity<?> joinHost(HttpServletRequest request, @RequestBody HostRequest hostRequest) {
        HostResponse hostResponse = new HostResponse();
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {

            String hostId = hostRequest.getHostId();
            String type = hostRequest.getType();
            hostId = type + "_" + hostId;
            boolean isNewHost = hostService.joinUser(hostId); // kakao id값을 통해 로그인 or 회원가입
            if (isNewHost) { // 새로 회원가입한 유저라면
                status = HttpStatus.CREATED;
            }

            String accessToken = jwtTokenProvider.createAccessToken("hostId", hostId); // 사용자 액세스 토큰 발급
            String refreshToken = jwtTokenProvider.createRefreshToken("hostId", hostId); // 사용자 리프레쉬 토큰 발급
            hostService.saveRefreshToken(hostId, refreshToken);
            logger.debug("로그인 accessToken 정보 : {}", accessToken);
            logger.debug("로그인 refreshToken 정보 : {}", refreshToken);
            Room room = hostService.getRoomByHostId(hostId);
            if (room != null) { // 생성한 방이 있는 유저라면
               hostResponse.setStatus(room.getStatus());
               if (room.getStatus() == 2){  // 방이 대기실 상태라면
                   hostResponse.setCode(room.getCode());
               }
            }
            hostResponse.setAccessToken(accessToken);
            hostResponse.setRefreshToken(refreshToken);
            resultMap.put("data", hostResponse);
            resultMap.put("message", SUCCESS);
            resultMap.put("success", TRUE);
            return new ResponseEntity<>(resultMap, status);

        } catch (Exception e) {
            logger.error("로그인 실패 : {}", e);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(status);
        }
    }


    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "로그아웃")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "401", description = "토큰 만료"),
            @ApiResponse(responseCode = "403", description = "토큰 에러(토큰 없음 / 권한 없음)"),
            @ApiResponse(responseCode = "500", description = "서버에러")
    })
    public ResponseEntity<?> logoutHost(HttpServletRequest request) {
        HttpStatus status = HttpStatus.OK;
        String header = request.getHeader("Authorization");
        String accessToken = jwtTokenProvider.getTokenByHeader(header);


        if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
            return tokenExceptionHandling();
        }


        if (jwtTokenProvider.validateToken(accessToken)) {
            String hostId = jwtTokenProvider.getHostID(accessToken);
            try {
                logger.info("로그아웃 시도");
                hostService.logoutHost(hostId);
                status = HttpStatus.OK;
                return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), status);
            } catch (Exception e) {
                logger.error("로그아웃 실패 : {}", e);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                return new ResponseEntity<>(status);
            }
        }else{  // 토큰이 만료된 경우
            logger.info("로그아웃 실패 액세스 토큰 만료");
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<>(new ResultDto(UNAUTHORIZED, FALSE), status);
        }
    }

    @PostMapping("/token/refresh")
    @Operation(summary = "액세스토큰 재발금", description = "액세스토큰 재발급")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "액세스토큰 재발급 성공"),
            @ApiResponse(responseCode = "401", description = "토큰 만료"),
            @ApiResponse(responseCode = "403", description = "토큰 에러(토큰 없음 / 권한 없음)"),
            @ApiResponse(responseCode = "500", description = "서버에러")
    })
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        HttpStatus status;
        HostResponse hostResponse = new HostResponse();
        String header = request.getHeader("Authorization");
        String refreshToken = jwtTokenProvider.getTokenByHeader(header);

        if(refreshToken == null){ // 토큰이 제대로 담겨오지 않은 경우
            logger.error("리프레쉬 토큰 에러");
            return tokenExceptionHandling();
        }


        if (jwtTokenProvider.validateToken(refreshToken)) {
            try {
                String hostId = jwtTokenProvider.getHostID(refreshToken);
                String hostRefreshToken = hostService.getRefreshtoken(hostId);
                if (hostRefreshToken == null ) {
                    logger.debug("로그인되지 않은 host");
                    status = HttpStatus.UNAUTHORIZED;
                    return new ResponseEntity<>(new ResultDto("not logged in host", FALSE), status);
                } else if (hostRefreshToken.equals(refreshToken)){ // 로그인 되어있고 리프레시 토큰도 일치할 경우
                    Map<String, Object> resultMap = new HashMap<>();
                    String accessToken = jwtTokenProvider.createAccessToken("hostId", hostId);
                    logger.debug("access-token : {}", accessToken);
                    logger.debug("access-token 재발급 완료");
                    status = HttpStatus.OK;
                    hostResponse.setAccessToken(accessToken);
                    resultMap.put("data",hostResponse);
                    resultMap.put("message", SUCCESS);
                    resultMap.put("success", TRUE);
                    return new ResponseEntity<>(resultMap, status);
                } else { // 잘못된 리프레쉬 토큰
                    status = HttpStatus.UNAUTHORIZED;
                    return new ResponseEntity<>(new ResultDto(TOKEN_ERROR, FALSE), status);
                }
            } catch (Exception e) {
                logger.error("액세스 토큰 재발급 실패 : {}", e);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                return new ResponseEntity<>(status);
            }
        }else{  // 리프레쉬 토큰이 만료된 경우
            logger.info("액세스 토큰 재발급 실패 리프레쉬 토큰 만료");
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
        }
    }

    @DeleteMapping("")
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "액세스토큰 재발급 성공"),
            @ApiResponse(responseCode = "401", description = "토큰 만료"),
            @ApiResponse(responseCode = "403", description = "토큰 에러(토큰 없음 / 권한 없음)"),
            @ApiResponse(responseCode = "500", description = "서버에러")
    })
    public ResponseEntity<?> deleteHost(HttpServletRequest request) {
        HttpStatus status = HttpStatus.OK;
        String header = request.getHeader("Authorization");
        String accessToken = jwtTokenProvider.getTokenByHeader(header);

        if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
            return tokenExceptionHandling();
        }


        if (jwtTokenProvider.validateToken(accessToken)) {
            String hostId = jwtTokenProvider.getHostID(accessToken);
            try {
                logger.info("회원탈퇴 시도");
                hostService.deleteHost(hostId);
                status = HttpStatus.OK;
                return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), status);
            } catch (Exception e) {
                logger.error("회원탈퇴 실패 : {}", e);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                return new ResponseEntity<>(status);
            }
        }else{  // 토큰이 만료된 경우
            logger.info("회원탈퇴 실패 액세스 토큰 만료");
            status = HttpStatus.UNAUTHORIZED;
            return new ResponseEntity<>(new ResultDto(UNAUTHORIZED, FALSE), status);
        }
    }

    private ResponseEntity<?> tokenExceptionHandling() {
        logger.error("토큰 에러");
        HttpStatus status = HttpStatus.FORBIDDEN;
        return new ResponseEntity<>(new ResultDto(TOKEN_ERROR, FALSE), status);
    }
}

package com.tada.domain.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostResponse {
    private String accessToken;
    private String refreshToken;

    private int roomStatus;
    private Long roomId;

    public HostResponse() {
        this.roomStatus = 0;
    }
}

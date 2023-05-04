package com.tada.domain.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostResponse {
    private String accessToken;
    private String refreshToken;

    private int status;
    private String code;

    public HostResponse() {
        this.status = 0;
    }
}

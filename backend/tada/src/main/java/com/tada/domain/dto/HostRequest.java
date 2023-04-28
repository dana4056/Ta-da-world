package com.tada.domain.dto;


import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
public class HostRequest {
    private String hostId;
    private String type;
}

package com.tada.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "host")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Host {

    @Id
    private String id;
    private LocalDateTime createTime;
    private LocalDateTime modTime;
    private String refreshToken;

    public void updateCreateTime(LocalDateTime localDateTime) {
        this.createTime = localDateTime;
    }

    public void updateId(String id) { this.id = id; }

    public void updateRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }
}

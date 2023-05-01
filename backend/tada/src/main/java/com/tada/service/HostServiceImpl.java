package com.tada.service;

import com.tada.domain.entity.Host;
import com.tada.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class HostServiceImpl implements HostService{


    @Autowired
    private HostRepository hostRepository;

    @Override
    public boolean joinUser(String hostId) throws Exception {
        boolean isNew = false; // 새로 회원가입하는 유저 여부
        try {
            Host host = hostRepository.findById(hostId).orElse(null); // 이미 있는 유저인지 확인
            if (host == null) { // 새로 가입하는 사람
                isNew = true;
                host = new Host();
                host.updateCreateTime(LocalDateTime.now());
                host.updateId(hostId);
                hostRepository.save(host);
            }
        } catch (Exception e){
            e.printStackTrace();
            throw new Exception(e);
        }

        return isNew;
    }

    @Override
    public void saveRefreshToken(String hostId, String refreshToken) {
        try {
            Host host = hostRepository.findById(hostId).orElse(null);
            host.updateRefreshToken(refreshToken);
            hostRepository.save(host);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public void logoutHost(String hostId) throws Exception{
        try {
            Host host = hostRepository.findById(hostId).orElse(null);
            host.updateRefreshToken(null);
            hostRepository.save(host);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}

package com.tada.repository;

import com.tada.domain.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, String> {
    Host FindByHost_id(String hostId);
}

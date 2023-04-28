package com.tada.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tada.domain.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	List<User> findAllByRoom_Id(Long roomId);
}

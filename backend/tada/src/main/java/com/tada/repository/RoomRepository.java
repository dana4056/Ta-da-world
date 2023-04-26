package com.tada.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tada.domain.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {
}

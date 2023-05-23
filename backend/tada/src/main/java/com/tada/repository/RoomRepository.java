package com.tada.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tada.domain.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

	boolean existsByHost_IdAndStatusLessThan(String hostId, int status);

	Room findByHost_IdAndStatusLessThan(String hostId, int status);

	Room findByHost_IdAndStatus(String hostId, int status);

	Optional<Room> findByCode(String code);
}

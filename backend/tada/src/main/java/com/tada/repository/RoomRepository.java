package com.tada.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tada.domain.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
	boolean existsByHost_IdAndStatus(Long hostId, int status);

	boolean existsByHost_IdAAndStatusLessThan(Long hostId, int status);
}

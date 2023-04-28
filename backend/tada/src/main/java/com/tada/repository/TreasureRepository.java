package com.tada.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tada.domain.entity.Room;
import com.tada.domain.entity.Treasure;

public interface TreasureRepository extends JpaRepository<Treasure, Long> {
	List<Treasure> findAllByRoom_Id(Long roomId);
	List<Treasure> findAllByRoom_IdAndFinder_Id(Long roomId, Long userId);
}

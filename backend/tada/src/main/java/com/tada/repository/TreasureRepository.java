package com.tada.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tada.domain.entity.Room;
import com.tada.domain.entity.Treasure;

public interface TreasureRepository extends JpaRepository<Treasure, Long> {
	List<Treasure> findAllByRoom_Id(Long roomId);
	List<Treasure> findAllByRoom_IdAndFinder_Id(Long roomId, String userId);
	Long countByRoom_Id(Long roomId);

	@Query("SELECT t.finder, COUNT(t) FROM Treasure t WHERE t.room.id = :roomId GROUP BY t.finder ORDER BY COUNT(t) DESC")
	List<Object[]> countByFinderAndRoomId(@Param("roomId") Long roomId);
}

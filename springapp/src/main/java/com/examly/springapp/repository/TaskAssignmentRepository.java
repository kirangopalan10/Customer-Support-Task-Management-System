package com.examly.springapp.repository;

import com.examly.springapp.model.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    
    @Query("SELECT ta FROM TaskAssignment ta WHERE ta.assignedUser.id = :userId")
    List<TaskAssignment> findByAssignedUserId(@Param("userId") Long userId);
}
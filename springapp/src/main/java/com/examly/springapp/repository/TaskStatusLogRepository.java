package com.examly.springapp.repository;

import com.examly.springapp.model.TaskStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskStatusLogRepository extends JpaRepository<TaskStatusLog, Long> {
    
    @Query("SELECT tsl FROM TaskStatusLog tsl WHERE tsl.task.id = :taskId")
    List<TaskStatusLog> findByTaskId(@Param("taskId") Long taskId);
    
    @Query("SELECT tsl FROM TaskStatusLog tsl WHERE tsl.oldStatus = :oldStatus")
    List<TaskStatusLog> findByOldStatus(@Param("oldStatus") String oldStatus);
}
package com.examly.springapp.service;

import com.examly.springapp.model.TaskAssignment;
import java.util.List;
import java.util.Optional;

public interface TaskAssignmentService {
    TaskAssignment saveAssignment(TaskAssignment assignment);
    List<TaskAssignment> getAllAssignments();
    Optional<TaskAssignment> getAssignmentById(Long id);
    List<TaskAssignment> getAssignmentsByUserId(Long userId);
}
package com.examly.springapp.service;

import com.examly.springapp.model.TaskAssignment;
import com.examly.springapp.repository.TaskAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskAssignmentServiceImpl implements TaskAssignmentService {
    
    @Autowired
    private TaskAssignmentRepository assignmentRepository;
    
    @Override
    public TaskAssignment saveAssignment(TaskAssignment assignment) {
        return assignmentRepository.save(assignment);
    }
    
    @Override
    public List<TaskAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
    
    @Override
    public Optional<TaskAssignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }
    
    @Override
    public List<TaskAssignment> getAssignmentsByUserId(Long userId) {
        return assignmentRepository.findByAssignedUserId(userId);
    }
}
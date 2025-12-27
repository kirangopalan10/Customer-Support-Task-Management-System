package com.examly.springapp.controller;

import com.examly.springapp.model.TaskAssignment;
import com.examly.springapp.service.TaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
public class TaskAssignmentController {
    
    @Autowired
    private TaskAssignmentService assignmentService;
    
    @PostMapping
    public ResponseEntity<TaskAssignment> createAssignment(@RequestBody TaskAssignment assignment) {
        TaskAssignment savedAssignment = assignmentService.saveAssignment(assignment);
        return new ResponseEntity<>(savedAssignment, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<TaskAssignment>> getAllAssignments() {
        List<TaskAssignment> assignments = assignmentService.getAllAssignments();
        return new ResponseEntity<>(assignments, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskAssignment> getAssignmentById(@PathVariable Long id) {
        Optional<TaskAssignment> assignment = assignmentService.getAssignmentById(id);
        return assignment.map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                        .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<String> getAssignmentsByUserId(@PathVariable Long userId) {
        List<TaskAssignment> assignments = assignmentService.getAssignmentsByUserId(userId);
        if (assignments.isEmpty()) {
            return new ResponseEntity<>("No assignments found for user id: " + userId, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
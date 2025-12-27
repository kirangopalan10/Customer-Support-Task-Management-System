package com.examly.springapp.service;

import com.examly.springapp.model.TaskStatusLog;
import com.examly.springapp.repository.TaskStatusLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskStatusLogServiceImpl implements TaskStatusLogService {
    
    @Autowired
    private TaskStatusLogRepository statusLogRepository;
    
    @Override
    public TaskStatusLog saveStatusLog(TaskStatusLog statusLog) {
        return statusLogRepository.save(statusLog);
    }
    
    @Override
    public List<TaskStatusLog> getAllStatusLogs() {
        return statusLogRepository.findAll();
    }
    
    @Override
    public Optional<TaskStatusLog> getStatusLogById(Long id) {
        return statusLogRepository.findById(id);
    }
    
    @Override
    public List<TaskStatusLog> getLogsByTask(Long taskId) {
        return statusLogRepository.findByTaskId(taskId);
    }
    
    @Override
    public List<TaskStatusLog> getLogsByOldStatus(String oldStatus) {
        return statusLogRepository.findByOldStatus(oldStatus);
    }
}
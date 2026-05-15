package com.project.backend.domain.map.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/map")
public class MapController {

    @GetMapping("/status")
    public Map<String, String> getMapStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ok");
        status.put("message", "Map domain is active");
        return status;
    }
}

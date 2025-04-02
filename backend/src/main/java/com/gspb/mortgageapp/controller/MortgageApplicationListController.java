package com.gspb.mortgageapp.controller;

import com.gspb.mortgageapp.model.MortgageApplication;
import com.gspb.mortgageapp.repository.MortgageApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mortgage")
public class MortgageApplicationListController {

    private final MortgageApplicationRepository mortgageApplicationRepository;

    @Autowired
    public MortgageApplicationListController(MortgageApplicationRepository mortgageApplicationRepository) {
        this.mortgageApplicationRepository = mortgageApplicationRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<List<MortgageApplication>> getAllMortgageApplications() {
        List<MortgageApplication> applications = mortgageApplicationRepository.findAll();
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }
}

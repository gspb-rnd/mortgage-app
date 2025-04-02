package com.gspb.mortgageapp.controller;

import com.gspb.mortgageapp.model.MortgageApplication;
import com.gspb.mortgageapp.service.MortgageApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mortgage")
public class MortgageApplicationController {

    private final MortgageApplicationService mortgageApplicationService;

    @Autowired
    public MortgageApplicationController(MortgageApplicationService mortgageApplicationService) {
        this.mortgageApplicationService = mortgageApplicationService;
    }

    @PostMapping("/create")
    public ResponseEntity<MortgageApplication> createMortgageApplication(@Valid @RequestBody MortgageApplication mortgageApplication) {
        MortgageApplication createdApplication = mortgageApplicationService.createMortgageApplication(mortgageApplication);
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MortgageApplication> getMortgageApplication(@PathVariable String id) {
        return mortgageApplicationService.getMortgageApplicationById(id)
                .map(application -> new ResponseEntity<>(application, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MortgageApplication> updateMortgageApplication(
            @PathVariable String id,
            @Valid @RequestBody MortgageApplication mortgageApplication) {
        try {
            MortgageApplication updatedApplication = mortgageApplicationService.updateMortgageApplication(id, mortgageApplication);
            return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/requirements")
    public ResponseEntity<Map<String, List<String>>> getRequiredFields(@RequestBody MortgageApplication mortgageApplication) {
        List<String> requiredFields = mortgageApplicationService.getRequiredFields(mortgageApplication);
        return new ResponseEntity<>(Map.of("requiredFields", requiredFields), HttpStatus.OK);
    }
}

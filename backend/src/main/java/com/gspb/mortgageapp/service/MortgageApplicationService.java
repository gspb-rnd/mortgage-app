package com.gspb.mortgageapp.service;

import com.gspb.mortgageapp.model.MortgageApplication;
import com.gspb.mortgageapp.repository.MortgageApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class MortgageApplicationService {

    private final MortgageApplicationRepository mortgageApplicationRepository;

    @Autowired
    public MortgageApplicationService(MortgageApplicationRepository mortgageApplicationRepository) {
        this.mortgageApplicationRepository = mortgageApplicationRepository;
    }

    public MortgageApplication createMortgageApplication(MortgageApplication mortgageApplication) {
        LocalDateTime now = LocalDateTime.now();
        mortgageApplication.setCreatedAt(now);
        mortgageApplication.setUpdatedAt(now);
        
        if (mortgageApplication.getCompleted() == null) {
            mortgageApplication.setCompleted(false);
        }
        
        List<String> requiredFields = determineRequiredFields(mortgageApplication);
        mortgageApplication.setRequiredFields(requiredFields);
        
        return mortgageApplicationRepository.save(mortgageApplication);
    }

    public Optional<MortgageApplication> getMortgageApplicationById(String id) {
        return mortgageApplicationRepository.findById(id);
    }

    public MortgageApplication updateMortgageApplication(String id, MortgageApplication updatedApplication) {
        return mortgageApplicationRepository.findById(id)
                .map(existingApplication -> {
                    if (updatedApplication.getLoanAmount() != null) {
                        existingApplication.setLoanAmount(updatedApplication.getLoanAmount());
                    }
                    if (updatedApplication.getInterestRate() != null) {
                        existingApplication.setInterestRate(updatedApplication.getInterestRate());
                    }
                    if (updatedApplication.getLoanTerm() != null) {
                        existingApplication.setLoanTerm(updatedApplication.getLoanTerm());
                    }
                    if (updatedApplication.getPropertyType() != null) {
                        existingApplication.setPropertyType(updatedApplication.getPropertyType());
                    }
                    if (updatedApplication.getPropertyValue() != null) {
                        existingApplication.setPropertyValue(updatedApplication.getPropertyValue());
                    }
                    if (updatedApplication.getBorrowerName() != null) {
                        existingApplication.setBorrowerName(updatedApplication.getBorrowerName());
                    }
                    if (updatedApplication.getIncome() != null) {
                        existingApplication.setIncome(updatedApplication.getIncome());
                    }
                    if (updatedApplication.getCreditScore() != null) {
                        existingApplication.setCreditScore(updatedApplication.getCreditScore());
                    }
                    if (updatedApplication.getEmploymentStatus() != null) {
                        existingApplication.setEmploymentStatus(updatedApplication.getEmploymentStatus());
                    }
                    if (updatedApplication.getDownPayment() != null) {
                        existingApplication.setDownPayment(updatedApplication.getDownPayment());
                    }
                    if (updatedApplication.getLoanType() != null) {
                        existingApplication.setLoanType(updatedApplication.getLoanType());
                    }
                    if (updatedApplication.getFirstTimeBuyer() != null) {
                        existingApplication.setFirstTimeBuyer(updatedApplication.getFirstTimeBuyer());
                    }
                    if (updatedApplication.getCoBorrowerInfo() != null) {
                        existingApplication.setCoBorrowerInfo(updatedApplication.getCoBorrowerInfo());
                    }
                    if (updatedApplication.getRegion() != null) {
                        existingApplication.setRegion(updatedApplication.getRegion());
                    }
                    if (updatedApplication.getGovernmentAssistance() != null) {
                        existingApplication.setGovernmentAssistance(updatedApplication.getGovernmentAssistance());
                    }
                    if (updatedApplication.getCompleted() != null) {
                        existingApplication.setCompleted(updatedApplication.getCompleted());
                    }
                    
                    existingApplication.setUpdatedAt(LocalDateTime.now());
                    
                    List<String> requiredFields = determineRequiredFields(existingApplication);
                    existingApplication.setRequiredFields(requiredFields);
                    
                    return mortgageApplicationRepository.save(existingApplication);
                })
                .orElseThrow(() -> new RuntimeException("Mortgage application not found with id: " + id));
    }

    public List<String> getRequiredFields(MortgageApplication application) {
        return determineRequiredFields(application);
    }

    private List<String> determineRequiredFields(MortgageApplication application) {
        List<String> requiredFields = new ArrayList<>(Arrays.asList(
                "loanAmount", "interestRate", "loanTerm", "propertyType", 
                "propertyValue", "borrowerName", "income", "creditScore", 
                "employmentStatus", "downPayment", "loanType", "firstTimeBuyer", "region"
        ));
        
        if (application.getLoanType() != null) {
            String loanType = application.getLoanType();
            if ("FHA".equals(loanType) || "VA".equals(loanType) || "USDA".equals(loanType)) {
                requiredFields.add("governmentAssistance");
            }
        }
        
        if (application.getRegion() != null) {
            String region = application.getRegion();
            if ("California".equals(region) || "CA".equals(region)) {
                requiredFields.add("californiaDisclosure");
            }
            if ("New York".equals(region) || "NY".equals(region)) {
                requiredFields.add("newYorkDisclosure");
            }
        }
        
        if (application.getLoanAmount() != null) {
            BigDecimal loanAmount = application.getLoanAmount();
            if (loanAmount.compareTo(new BigDecimal("647200")) > 0) {
                requiredFields.add("jumboLoanDisclosure");
            }
        }
        
        if (application.getFirstTimeBuyer() != null && application.getFirstTimeBuyer()) {
            requiredFields.add("firstTimeBuyerCertification");
        }
        
        return requiredFields;
    }
}

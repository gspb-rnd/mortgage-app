package com.gspb.mortgageapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "mortgageInfo")
public class MortgageApplication {

    @Id
    private String id;
    
    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be positive")
    private BigDecimal loanAmount;
    
    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Interest rate must be positive")
    @DecimalMax(value = "100.0", inclusive = true, message = "Interest rate must be less than or equal to 100")
    private BigDecimal interestRate;
    
    @NotNull(message = "Loan term is required")
    private Integer loanTerm;
    
    @NotNull(message = "Property type is required")
    private String propertyType;
    
    @NotNull(message = "Property value is required")
    @Positive(message = "Property value must be positive")
    private BigDecimal propertyValue;
    
    @NotBlank(message = "Borrower name is required")
    private String borrowerName;
    
    @NotNull(message = "Income is required")
    @Positive(message = "Income must be positive")
    private BigDecimal income;
    
    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 850, message = "Credit score must be at most 850")
    private Integer creditScore;
    
    @NotNull(message = "Employment status is required")
    private String employmentStatus;
    
    @NotNull(message = "Down payment is required")
    @Positive(message = "Down payment must be positive")
    private BigDecimal downPayment;
    
    @NotNull(message = "Loan type is required")
    private String loanType;
    
    @NotNull(message = "First-time buyer status is required")
    private Boolean firstTimeBuyer;
    
    private CoBorrowerInfo coBorrowerInfo;
    
    @NotBlank(message = "Region/State is required")
    private String region;
    
    private Boolean governmentAssistance;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Boolean completed;
    
    private List<String> requiredFields;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getLoanTerm() {
        return loanTerm;
    }

    public void setLoanTerm(Integer loanTerm) {
        this.loanTerm = loanTerm;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public BigDecimal getPropertyValue() {
        return propertyValue;
    }

    public void setPropertyValue(BigDecimal propertyValue) {
        this.propertyValue = propertyValue;
    }

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public BigDecimal getDownPayment() {
        return downPayment;
    }

    public void setDownPayment(BigDecimal downPayment) {
        this.downPayment = downPayment;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Boolean getFirstTimeBuyer() {
        return firstTimeBuyer;
    }

    public void setFirstTimeBuyer(Boolean firstTimeBuyer) {
        this.firstTimeBuyer = firstTimeBuyer;
    }

    public CoBorrowerInfo getCoBorrowerInfo() {
        return coBorrowerInfo;
    }

    public void setCoBorrowerInfo(CoBorrowerInfo coBorrowerInfo) {
        this.coBorrowerInfo = coBorrowerInfo;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Boolean getGovernmentAssistance() {
        return governmentAssistance;
    }

    public void setGovernmentAssistance(Boolean governmentAssistance) {
        this.governmentAssistance = governmentAssistance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public List<String> getRequiredFields() {
        return requiredFields;
    }

    public void setRequiredFields(List<String> requiredFields) {
        this.requiredFields = requiredFields;
    }
}

package com.gspb.mortgageapp.model;

import javax.validation.constraints.*;
import java.math.BigDecimal;

public class CoBorrowerInfo {
    
    @NotBlank(message = "Co-borrower name is required")
    private String name;
    
    @NotNull(message = "Co-borrower income is required")
    @Positive(message = "Co-borrower income must be positive")
    private BigDecimal income;
    
    @NotNull(message = "Co-borrower credit score is required")
    @Min(value = 300, message = "Co-borrower credit score must be at least 300")
    @Max(value = 850, message = "Co-borrower credit score must be at most 850")
    private Integer creditScore;
    
    @NotNull(message = "Co-borrower employment status is required")
    private String employmentStatus;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}

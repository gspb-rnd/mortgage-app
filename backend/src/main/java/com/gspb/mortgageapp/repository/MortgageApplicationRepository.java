package com.gspb.mortgageapp.repository;

import com.gspb.mortgageapp.model.MortgageApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MortgageApplicationRepository extends MongoRepository<MortgageApplication, String> {
}

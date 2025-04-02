package com.gspb.mortgageapp;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=${MongoConnectionString}"
})
public class MongoDirectConnectionTest {

    @Test
    public void testDirectMongoConnection() {
        String mongoUri = System.getenv("MongoConnectionString");
        String mongoUser = System.getenv("MongoUser");
        String mongoPassword = System.getenv("MongoPassword");
        
        System.out.println("Testing direct MongoDB connection");
        System.out.println("Connection string available: " + (mongoUri != null && !mongoUri.isEmpty()));
        System.out.println("Username available: " + (mongoUser != null && !mongoUser.isEmpty()));
        System.out.println("Password available: " + (mongoPassword != null && !mongoPassword.isEmpty()));
        
        assertNotNull(mongoUri, "MongoDB connection string must be provided");
        
        try {
            ConnectionString connectionString = new ConnectionString(mongoUri);
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .build();
            
            MongoClient mongoClient = MongoClients.create(settings);
            
            MongoDatabase database = mongoClient.getDatabase("mortgage-app");
            assertNotNull(database, "Database should not be null");
            
            System.out.println("MongoDB collections:");
            database.listCollectionNames().forEach(name -> System.out.println(" - " + name));
            
            mongoClient.close();
            System.out.println("MongoDB connection test successful");
        } catch (Exception e) {
            System.err.println("MongoDB connection test failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}

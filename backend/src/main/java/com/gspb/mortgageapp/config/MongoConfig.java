package com.gspb.mortgageapp.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableMongoRepositories(basePackages = "com.gspb.mortgageapp.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Value("${spring.data.mongodb.username:${MONGO_USER:}}")
    private String username;

    @Value("${spring.data.mongodb.password:${MONGO_PASSWORD:}}")
    private String password;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        System.out.println("Connecting to MongoDB with database: " + databaseName);
        System.out.println("Username provided: " + (username != null && !username.isEmpty()));
        System.out.println("Connection string available: " + (mongoUri != null && !mongoUri.isEmpty()));
        
        try {
            if (mongoUri != null && !mongoUri.isEmpty()) {
                System.out.println("Using connection string from environment");
                ConnectionString connectionString = new ConnectionString(mongoUri);
                
                MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                        .applyConnectionString(connectionString)
                        .applyToSslSettings(builder -> {
                            builder.enabled(true);
                            builder.invalidHostNameAllowed(true);
                        })
                        .applyToSocketSettings(builder -> 
                            builder.connectTimeout(60000, TimeUnit.MILLISECONDS)
                                   .readTimeout(60000, TimeUnit.MILLISECONDS))
                        .applyToClusterSettings(builder -> 
                            builder.serverSelectionTimeout(60000, TimeUnit.MILLISECONDS))
                        .build();
                
                return MongoClients.create(mongoClientSettings);
            } 
            else if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
                System.out.println("Using separate username/password authentication");
                String host = "localhost";
                int port = 27017;
                
                MongoCredential credential = MongoCredential.createCredential(
                        username, 
                        databaseName, 
                        password.toCharArray());
                
                MongoClientSettings settings = MongoClientSettings.builder()
                        .credential(credential)
                        .applyToSslSettings(builder -> {
                            builder.enabled(true);
                            builder.invalidHostNameAllowed(true);
                        })
                        .applyToSocketSettings(builder -> 
                            builder.connectTimeout(60000, TimeUnit.MILLISECONDS)
                                   .readTimeout(60000, TimeUnit.MILLISECONDS))
                        .applyToClusterSettings(builder -> 
                            builder.hosts(Collections.singletonList(new ServerAddress(host, port)))
                                   .serverSelectionTimeout(60000, TimeUnit.MILLISECONDS))
                        .build();
                
                return MongoClients.create(settings);
            } else {
                System.out.println("No authentication credentials provided, connecting without auth");
                return MongoClients.create();
            }
        } catch (Exception e) {
            System.err.println("Error creating MongoDB client: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}

package com.tutoraty.springbootlibrary.config;

import com.tutoraty.springbootlibrary.entity.Book;
import com.tutoraty.springbootlibrary.entity.Message;
import com.tutoraty.springbootlibrary.entity.Review;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {  //RepositoryRestConfigurer will help is configure RestRepositpry

    private String theAllowedOrigins = "https://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, //RepositoryRestConfiguration is came here with RepositoryRestConfigurer
                                     CorsRegistry cors) {
    	//these are the HttpMethods which we do not want to perform on Book, Review, Message externally 
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.PUT};

        //RepositoryRestConfiguration will give the json object at the localhost for Book, Review and Message repository
        config.exposeIdsFor(Book.class);
        config.exposeIdsFor(Review.class);
        config.exposeIdsFor(Message.class);

        //now here we disabling the unwanted Http methods on Book, Review, and Message object
        disableHttpMethods(Book.class, config, theUnsupportedActions);
        disableHttpMethods(Review.class, config,theUnsupportedActions);
        disableHttpMethods(Message.class, config,theUnsupportedActions);

        /* Configure CORS Mapping */
        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass,
                                    RepositoryRestConfiguration config,
                                    HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) ->
                        httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) ->
                        httpMethods.disable(theUnsupportedActions));
    }
}

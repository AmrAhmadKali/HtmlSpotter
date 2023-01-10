# HtmlSpotter

A Chatbot to be used as initial diagnostic for psychological symptoms of common prevalence. 

## Background 

The idea of "Seelenarzt" in english mind doctor is to use a simple dictionary object to search and spot specific HTML Elements to generate a chat answer. And at the
end of conversation it summs up the result by stating possible diagnosis that the actual doctor should care about. 
The code was designed to implement Fallback when the chatbot doesn not understand the user, and to have  JSON file to seperate data and specific Answers of the chatbot
from the actual code. The bot can also have multiple users dialing in and running the server at the same time. 

## Usage 

Inside the cloned project, you should be able to run the program by typing in terminal.
  
  > node staticExpress.js

then by openning a browser and going to http://localhost:8081 

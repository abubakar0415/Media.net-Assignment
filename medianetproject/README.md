
I have created the entire application using just Vanila Javascript. You can access the website using index.html file. However, if you just open index.html file in Chrome, it won't load the JSON data. The reason for this is that due to security reasons Chrome does not allow making HTTP request to local JSON files. 

Hence, you will have to either use a different browser OR create a web server to serve the index.html file.

You can use the 'Live Server' extension on VS Code which will let you create an HTTP server, post which you will be able to properly run the application. 

Steps to install and use Live Server:
 1. Search for Live Server in extensions panel
 2. Install Live Server
 3. Right click on index.html file and select "Open with Live Server
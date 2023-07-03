## Hosted Project
[Community APIs](https://community-apis-1812.onrender.com)


#### Setup Basic Express Server

- import express and assign to variable
- setup start port variable (1812) and start function

## Usega
APIs are to be used in simple social media applications that contain communities among users 
and allow users to add posts (text, images, or both) as well as interact with posts through 
comments or likes in real-time.
APIs for user authentication POST request to signup user, POST request to login user, 
POST request to forget password, POST request to verify reset code from POST 
request forget password and POST request to reset password.
APIs for CRUD operations on Posts, APIs for GET all likes, POST for adding like and DELETE for 
removing like, APIs for CRUD operations on Comments and use socket.io to allows for instant 
updates and notifications to all connected clients during interactive with post.

## :bulb: Built Using

- MongoDB
- Express
- Node.JS
- Javascript
- jsonwebtoken for authentication and authorization
- nodemailer
- Multer
- Socket.io

### To Install all the dependencies

```
npm install
```
### Start API

```
npm start
```

## Routes

### Authentication
```
POST   registration    /api/v1/user/signup
POST   login   /api/v1/user/login
POST  forget password   /api/v1/user/forgetPassword
POST  verify rest code     /api/v1/user/verifyResetCode
POST reset password   /api/v1/user/resetPassword
```

### Posts
```
POST   add post    /api/v1/posts  
PATCH   update post   /api/v1/posts/643a1a9e9deef6782df77f4a
GET  get all posts   /api/v1/posts?limit=5&page=1  (With pagination)
GET  get specific post     /api/v1/posts/6446e3a8345aec8e18cfce80
DELETE delete specific post   /api/v1/posts/643a2454be70c03128ba9a7c
POST add like   /api/v1/posts/643a257b7cbaafadc7905031/likes (With use socket.io to emit event and listen event for real time app)
GET get all likes   /api/v1/posts/643a257b7cbaafadc7905031/likes
DELETE delete like    /api/v1/posts/643a257b7cbaafadc7905031/likes (With use socket.io to emit event and listen event for real time app)
```

### Comments
```
POST   add comment    /api/v1/posts/6446e3a8345aec8e18cfce80/comments   (With use socket.io to emit event and listen event for real time app)
GET  get all comments   /api/v1/posts/643a257b7cbaafadc7905031/comments
PATCH   update specific comment   /api/v1/posts/643a257b7cbaafadc7905031/comments/643a2e02a1fe83ff64776586  (With use socket.io to emit event and listen event for real time app)
DELETE delete specific comment   /api/v1/posts/643a257b7cbaafadc7905031/comments/643a38f14ac1bfabdb8530fd  (With use socket.io to emit event and listen event for real time app)
```

## :man: Project Created & Maintained By -

- **Hey guys, I'm Jayvardhan. Find out more about me** [ here](https://www.linkedin.com/in/mahmoud-hamdi-62bb1223b)
- **Reach out to me at** [mahmoud.backend.dev@gmail.com](mahmoud.backend.dev@gmail.com)

<h3 align="right">Built with :heart: by Mahmoud Hamdi</h3>

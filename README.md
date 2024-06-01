
# internship-restfull-api
Basic RESTful API serves as the backend for the Internship Website, facilitating interactions between students and companies. 

 * **Student Functionality:**

    * Students can register and log in to their accounts.
    * After authorization, students can edit/update their profile details.
    * Students can view available internships and apply for them after updating their profile details.
   
 * **Company Functionality:** 

    * Companies can register and log in to their accounts.
   * After authorization, companies can post new internships and update existing ones.
   * Companies can view applications submitted by students for their posted internships.

**DESCRIPTION**
* Built a RESTful API in Node.js using the MVC approach with MongoDB as the database.
* Implemented JWT (JSON Web Tokens) for authentication and authorization.

**BASIC REQUIREMENTS**
* **Server:** Node.js, Express.js
* **Database:** MongoDB



## Running internship application

To run the `internship` application, follow these steps:

1. Ensure that you have Node.js and npm installed on your system.

2. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Dipali127/internship_backend.git
    ```

3. Navigate to the root directory of the project:

    ```bash
   cd internship_backend
    ```

4. Install dependencies:


    ```bash
    npm install 
    ```

5. Set up any necessary environment variables or configuration files. 

6. Start the application:

    ```bash
    npm start
    ```

Before starting the application, ensure that you have set up the following:

- **Environment Variables**: 
    - Create a new file named `.env` in the root directory of the project.
    - Set the following required environment variables in the `.env` file:
        - `PORT`: Set this variable to the desired port number. By default, the application listens on port 3000.
        - `DATABASE_CLUSTER_STRING`: Set the variable to the connection string for your MongoDB database cluster.
        - `secretKey`:  Set the variable to the secret key used for JWT authentication.
        - `cloudinary_credentials`: Set the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET variables with your individual Cloudinary credentials for uploading files.

- **Database Setup**: 

    - Install Mongoose, the MongoDB object modeling tool for Node.js, by running the following command in your terminal:

    ```bash
    npm install mongoose
    ```

    
**For Testing (Postman)**
* Postman extension can be used for testing !

**Dependencies**
* For dependencies refer Package.json
### Available API Routes

To keep the project structure simple and easy to manage, all the routes have been written in a single file.

#### Student Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /student/signup`      | Sign up a new student                      |
| `POST /student/login`       | Login a student                            |
| `PUT /update/:studentID`    | Update a particular student's details      |

#### Company Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /company/signup`      | Sign up a new company                      |
| `POST /company/login`       | Login a company                            |

#### Internship Routes

| Routes                                | Description                            |
| ------------------------------------- | -------------------------------------- |
| `POST /postInternship/:companyId`     | Company posts an internship            |
| `PUT /updateInternship/:internshipId` | Company updates an internship          |
| `GET /internships/list`               | Student gets list of all internships   |

#### Application Routes

| Routes                                        | Description                                 |
| --------------------------------------------- | ------------------------------------------- |
| `POST /apply/:studentID`                      | Student applies for an internship           |
| `GET /getAllAppliedStudents/:internshipId`    | Company gets all applied students' applications |

## Student Routes
**1) Sign up a new Student**

Send a POST request to create a new student account.

````
Method: POST 
URL: /student/signup
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /student/signup
* **Response:**
```json
     {
    "status": true,
    "message": "Student registered successfully",
    "studentData": {
        "name": "Deepali Bohara",
        "email": "Deep45@gmail.com",
        "password": "$2b$10$sklyi5aBbFEW9g5F6CIT6OY.hTjtt96kVz6r2BDmwSCpsZoQoVsW.",
        "mobileNumber": "8872334556",
        "_id": "6655d959ce1639fb5e22baa4",
        "createdAt": "2024-05-28T13:17:13.461Z",
        "updatedAt": "2024-05-28T13:17:13.461Z",
        "__v": 0
    }
}
```
**2) Login Student**

Send a POST request to login an exisiting student.

````
Method: POST 
URL: /student/login
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /student/login
* **Response:**
```json
   {
    "status": true,
    "message": "Student login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SUQiOiI2NjU1ZDk1OWNlMTYzOWZiNWUyMmJhYTQiLCJ1c2VyIjoic3R1ZGVudCIsImlhdCI6MTcxNjkwODE1NywiZXhwIjoxNzE2OTExNzU3fQ.T91NkBKWxKz-XsnHuoPjFXlBTvgX9Gd4oEcTMAWhkyE"
}
```
**3) Update student details**

Send a PUT request to update an exisiting student's detail.

Student must be logged in to update his/her details.

````
Method: PUT 
URL: /update/:studentId
Authorization: {token}
Produces: application/json
````

**EXAMPLE**
* **Request:** PUT /update/6655d959ce1639fb5e22baa4
* **Response:**
```json
   {
    "status": true,
    "message": "Student details updated successfully",
    "data": {
        "_id": "6655d959ce1639fb5e22baa4",
        "name": "Deepali Bohara",
        "email": "Deep45@gmail.com",
        "password": "$2b$10$sklyi5aBbFEW9g5F6CIT6OY.hTjtt96kVz6r2BDmwSCpsZoQoVsW.",
        "mobileNumber": "8872334556",
        "createdAt": "2024-05-28T13:17:13.461Z",
        "updatedAt": "2024-05-28T15:15:28.982Z",
        "__v": 0,
        "DOB": "2020-09-02T07:00:00.000Z",
        "areaOfInterest": "Web Development",
        "city": "New Delhi",
        "collegeName": "Ganga Institute Of Technology",
        "state": "Delhi",
        "yearOfPassout": 2022
    }
}
```

## Company Routes
**1) Sign up a new Company**

Send a POST request to create a new student account.

````
Method: POST 
URL: /company/signup
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /company/signup
* **Response:**
```json
     {
    "status": true,
    "message": "Company registered successfully",
    "companyData": {
        "companyName": "Microsoft",
        "companyEmail": "mic221@gmail.com",
        "password": "$2b$10$FaXrMndfyrrHEZHuMsuHVO2vPhptvXzoOr7ifAOKec./AecxGnKqS",
        "contactNumber": "7768435678",
        "_id": "6655fc7c77768eee4437744d",
        "createdAt": "2024-05-28T15:47:08.300Z",
        "updatedAt": "2024-05-28T15:47:08.300Z",
        "__v": 0
    }
}
```
**2) Login Company**

Send a POST request to login an exisiting company.

````
Method: POST 
URL: /company/login
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /company/login
* **Response:**
```json
   {
    "status": true,
    "message": "Company login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SUQiOiI2NjU1ZmM3Yzc3NzY4ZWVlNDQzNzc0NGQiLCJ1c2VyIjoiY29tcGFueSIsImlhdCI6MTcxNjkxMTI0MiwiZXhwIjoxNzE2OTE0ODQyfQ.mWkUW1hDG1vXoSEBG-wmaPrevc_yxCQfgxxzGTRxzdw"
}
```


## Internship Routes
**1) Post an Internship**

Send a POST request to post an internship by a company.

The company must be logged in to post an internship.

````
Method: POST 
URL: /postInternship/:companyId
Authorization:{token}
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /postInternship/6655fc7c77768eee4437744d
* **Response:**
```json
   {
    "status": true,
    "message": "Internship successfully posted",
    "data": {
        "companyId": {
            "_id": "6655fc7c77768eee4437744d",
            "companyName": "Microsoft",
            "companyEmail": "mic221@gmail.com",
            "password": "$2b$10$FaXrMndfyrrHEZHuMsuHVO2vPhptvXzoOr7ifAOKec./AecxGnKqS",
            "contactNumber": "7768435678",
            "createdAt": "2024-05-28T15:47:08.300Z",
            "updatedAt": "2024-05-28T15:47:08.300Z",
            "__v": 0
        },
        "category": "Web Development",
        "position": "PhP Developer",
        "internshipType": "wfo",
        "skillsRequired": "Experience with PHP frameworks such as Laravel, Symfony, or CodeIgniter",
        "eligibility": "B.Tech,BCA,BSC(Computer Science)",
        "duration": "6 months",
        "location": {
            "state": "Delhi",
            "city": "New Delhi"
        },
        "applicationDeadline": "2024-07-08T07:00:00.000Z",
        "numberOfOpenings": 15,
        "stipend": "25000-30000",
        "status": "active",
        "_id": "6655fd3977768eee44377452",
        "createdAt": "2024-05-28T15:50:17.324Z",
        "updatedAt": "2024-05-28T15:50:17.324Z",
        "__v": 0
    }
}
```
**2) Update an internship**

Send a PUT request to update an existing internship.

The company must be logged in to update an existing internship.

````
Method: PUT 
URL: /updateInternship/:internshipId
Authorization:{token}
Produces: application/json
````

**EXAMPLE**
* **Request:** PUT /updateInternship/6655fd3977768eee44377452
* **Response:**
```json
   {
    "status": true,
    "message": "Status updated succesfully",
    "data": {
        "location": {
            "state": "Delhi",
            "city": "New Delhi"
        },
        "_id": "6655fd3977768eee44377452",
        "companyId": "6655fc7c77768eee4437744d",
        "category": "Web Development",
        "position": "PhP Developer",
        "internshipType": "wfo",
        "skillsRequired": "Experience with PHP frameworks such as Laravel, Symfony, or CodeIgniter",
        "eligibility": "B.Tech,BCA,BSC(Computer Science)",
        "duration": "4-6 months",
        "applicationDeadline": "2024-07-08T07:00:00.000Z",
        "numberOfOpenings": 15,
        "stipend": "25000-30000",
        "status": "active",
        "createdAt": "2024-05-28T15:50:17.324Z",
        "updatedAt": "2024-05-28T16:56:52.886Z",
        "__v": 0
    }
}
```
**3) Get list of all internship**

Send a GET request to retrieve the list of all available internships. Optionally, you can include query parameters to filter the results based on specific criteria.

Student must be logged in to fetch internships

````
Method: GET 
URL: /internships/list
Authorization: {token}
Produces: application/json
````

**EXAMPLE**
* **Request:** GET /internships/list
* **Response:**
```json
  {
    "status": true,
    "message": "Successfully fetched internships",
    "data": [
        {
            "BY": "Flipcart",
            "category": "Web Development",
            "position": "java Developer",
            "internshipType": "wfo",
            "skillsRequired": "Good knowledge of java, sql database and have a good grasp on DSA",
            "eligibility": "B.Tech",
            "duration": "3-6 months",
            "location": {
                "state": "Karnataka",
                "city": "Bengaluru"
            },
            "applicationDeadline": "2024-09-08T07:00:00.000Z",
            "numberOfOpenings": 12,
            "stipend": "20000-30000",
            "status": "active"
        },
        {
            "BY": "Google",
            "category": "Web Development",
            "position": "frontEnd Developer",
            "internshipType": "wfo",
            "skillsRequired": "Good knowledge of HTML, CSS,javascript and have a good grasp on DSA",
            "eligibility": "B.Tech,BCA,BSC(Computer Science)",
            "duration": "3 months",
            "location": {
                "state": "Delhi",
                "city": "New Delhi"
            },
            "applicationDeadline": "2024-08-08T07:00:00.000Z",
            "numberOfOpenings": 10,
            "stipend": "25000-30000",
            "status": "active"
        },
        {
            "BY": "Microsoft",
            "category": "Web Development",
            "position": "PhP Developer",
            "internshipType": "wfo",
            "skillsRequired": "Experience with PHP frameworks such as Laravel, Symfony, or CodeIgniter",
            "eligibility": "B.Tech,BCA,BSC(Computer Science)",
            "duration": "6 months",
            "location": {
                "state": "Delhi",
                "city": "New Delhi"
            },
            "applicationDeadline": "2024-07-08T07:00:00.000Z",
            "numberOfOpenings": 15,
            "stipend": "25000-30000",
            "status": "active"
        }
    ]
}
```

* **Request with Query Parameters:** GET /internships/list?location[state]=Karnataka
* **Response:**
```json
{
    "status": true,
    "message": "Successfully fetched internships",
    "data": [
        {
            "BY": "Flipcart",
            "category": "Web Development",
            "position": "java Developer",
            "internshipType": "wfo",
            "skillsRequired": "Good knowledge of java, sql database and have a good grasp on DSA",
            "eligibility": "B.Tech",
            "duration": "3-6 months",
            "location": {
                "state": "Karnataka",
                "city": "Bengaluru"
            },
            "applicationDeadline": "2024-09-08T07:00:00.000Z",
            "numberOfOpenings": 12,
            "stipend": "20000-30000",
            "status": "active"
        }
    ]
}
```
## Application Routes
**1) Apply on Internship**

Send a POST request to apply for an internship.

The student must be logged in to apply for an internship.

The student's resume should be uploaded as form data.

````
Method: POST 
URL: /apply/:studentID
Authorization: {token}
Produces: application/json
````

**EXAMPLE**
* **Request:** POST /apply/6655d959ce1639fb5e22baa4
* **Response:**
```json
   {
    "status": true,
    "message": "Application created successfully",
    "data": {
        "studentId": "6655d959ce1639fb5e22baa4",
        "internshipId": "6655faad77768eee4437743d",
        "resume": "http://res.cloudinary.com/dseknlpcn/image/upload/v1716912404/v8yflvjzqljcpklzolwe.pdf",
        "_id": "6656011477768eee44377462",
        "createdAt": "2024-05-28T16:06:44.889Z",
        "updatedAt": "2024-05-28T16:06:44.889Z",
        "__v": 0
    }
}
```
**2) Get all applied student's applications**

Send a GET request to fetch a list of applications for a specific internship.

The company must be logged in to retrieve the applications for an internship.

````
Method: GET 
URL: /getAllAppliedStudents/:internshipId
Authorization:{token}
Produces: application/json
````

**EXAMPLE**
* **Request:** GET /getAllAppliedStudents/6655fd3977768eee44377452
* **Response:**
```json
   {
    "status": true,
    "message": "successfully fetched all student who applied for internship of given internship",
    "Data": {
        "internshipId": "6655fd3977768eee44377452",
        "totalApplications": 1,
        "allStudentdetails": [
            {
                "resumeDownloadLink": "http://res.cloudinary.com/dseknlpcn/image/upload/v1716916228/ffeotnt9mxe3uawxzmrd.pdf"
            }
        ]
    }
}
```

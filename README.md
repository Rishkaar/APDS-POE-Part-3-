# APDS-POE-Part-3

# Project Overview 
This project is a comprehensive web application for a Payment Portal, designed to streamline secure payments and enhance the user experience. Built as a part of the APDS POE Part-3 group assignment, it includes essential features such as user registration, login, payment processing, and an admin dashboard for managing payments. Additionally, this application incorporates security features such as SSL, static admin login, JWT authentication, and rate limiting.

Group Members
* Rishkaar Sunnylall
* Aaron Omar
* Zayn Bux

# Table of Contents
* Technologies Used
* Features
* Folder Structure
* Setup and Installation
* Security Measures
* CI/CD Pipeline
* References
* Acknowledgments

# Technologies Used
* Backend: Node.js, Express, MongoDB
* Frontend: React, CSS (Custom styling for an elegant UI)
* Authentication: JSON Web Token (JWT)
* Security: SSL, Helmet, Rate Limiting
* DevOps: CircleCI, SonarQube for Continuous Integration and Code Quality
* Version Control: Git, GitHub

# Features
# User Features
* Registration: Users can sign up by providing their full name, ID number, account number, and password.
* Login: Allows users to log in with their account number and password.
* Payment Processing: Users (customers) can make payments by entering required payment details.
* Error Handling: Informative error messages are displayed on invalid actions or inputs.
  
# Admin Features
* Static Login: Admin login uses predefined credentials for simplicity and security.
* Payment Management: Admins can view all payments, delete payments, or process payments, with full control over the payment database.
* Dashboard: A centralized admin dashboard to manage the entire system.
  
# Security Measures
* SSL (Secure Sockets Layer): All traffic between the server and client is encrypted to protect sensitive information.
* JWT Authentication: Secure token-based authentication for users and admins.
* Helmet: Adds security headers to HTTP responses.
* Rate Limiting: Protects against DDoS attacks by limiting the number of requests per IP.
* Data Validation: Validation of input fields to avoid SQL injection and other malicious inputs.

# Folder Structure 
APDS-POE-Part-3/
│
├── payment-portal-backend/         # Backend code
│   ├── models/                     # MongoDB schemas
│   ├── routes/                     # Express routes for API
│   ├── middleware/                 # Authentication and authorization middleware
│   ├── server.js                   # Main server file
│   └── .env                        # Environment variables
│
├── payment-portal-frontend/        # Frontend code
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── App.js                  # Main React file
│   │   └── styles/                 # CSS files for styling
│   └── public/
│       └── index.html              # Main HTML file
│
└── .

# Setup and Installation 
Prerequisites
* Node.js and npm installed
* MongoDB installed and running
* Git installed

# Backend Setup
1. Clone the repository:
   git clone https://github.com/Rishkaar/APDS-POE-Part-3-.git
   cd APDS-POE-Part-3-/payment-portal-backend

2. Install dependencies:
   npm install

3. Set up environment variables: Create a .env file in payment-portal-backend and add the following:
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=443
   SSL KEY: Your_ssl_key

4. Start the server:
   node server.js

# Frontend Setup
1. Navigate to the frontend directory:
   cd ../payment-portal-frontend

2. Install dependencies:
   npm install

3. Start the React app:
   npm start

4. The application should now be running at https://localhost:3000 for the frontend and https://localhost:443 for the backend.
   
# Security Measures
1. This project incorporates several security best practices:
2. SSL (Secure Sockets Layer): Encrypts communication between client and server.
3. JWT Authentication: Secures user sessions with token-based authentication.
4. Helmet: Provides HTTP header protection.
5. Rate Limiting: Prevents DDoS attacks by limiting requests from each IP.
6. Static Admin Login: Simplified static admin login for enhanced control.
7. Data Validation: Strict validation of all user inputs to prevent malicious entries.

# CI/CD Pipeline
We have implemented a CI/CD pipeline using CircleCI and SonarQube:

1. CircleCI: Automates building, testing, and deployment.
   * A pipeline is configured in .circleci/config.yml.
   * This pipeline ensures code is built and tested with every commit.

2. SonarQube: Provides continuous code quality and security analysis.
   * Configured in the CircleCI pipeline to automatically analyze code quality.
   * Issues detected by SonarQube can block deployments if quality gates fail.

# Privacy Policy
**Introduction**
This Privacy Policy outlines the practices for collecting, using, and disclosing your information in connection with the Payment Portal application. We are committed to protecting your privacy and ensuring the security of your personal data.

**Information We Collect**
* Account Information: When you register or log in, we collect your full name, ID number, account number, and password.
* Payment Information: When you make a payment, we collect details such as the payment amount, currency, provider, recipient account, and SWIFT code.
* Usage Information: We may collect information about your use of the application, including activity logs, to help improve the user experience and enhance security.
  
**How We Use Your Information**
* To Provide and Improve Services: Your information helps us manage and facilitate payments and provide a personalized experience within the application.
* For Security and Compliance: We use your information to enhance security, prevent fraud, and comply with legal obligations.
* Communication: We may use your information to contact you with important updates regarding your account or the application.
  
**Data Protection and Security**
We use advanced security measures such as SSL encryption, JWT authentication, and data validation to protect your information. Access to your personal information is restricted to authorized personnel only, and we regularly monitor our systems to prevent unauthorized access.

**Data Retention**
We retain your information for as long as necessary to provide you with our services, comply with our legal obligations, and enforce our policies. Upon request, we can delete your personal data, except for information required for legal compliance.

**Changes to This Privacy Policy**
We may update our Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. We encourage you to review this page periodically to stay informed of any updates.

# Contact Information
For any questions, concerns, or suggestions regarding this project, please contact us:
* Rishkaar Sunnylall: rishkaars@gmail.com
* Aaron [Last Name]: aaron@gmail.com
* Zayn [Last Name]: zayn2gmail.com
  
Alternatively, you can reach the team through our GitHub repository:
* GitHub Repository: APDS-POE-Part-3

# References
* https://circleci.com/docs/
* https://www.mongodb.com/docs/
* https://expressjs.com/
* https://nodejs.org/docs/latest/api/
* https://sonarcloud.io/project/overview?id=Rishkaar_APDS-POE-Part-3-
* https://app.circleci.com/pipelines/github/Rishkaar/APDS-POE-Part-3-?branch=circleci-project-setup

# Acknowledgments
This project was completed as part of a group assignment for APDS POE Part-3. Special thanks to all team members for their contributions and efforts in implementing the various features and security measures.













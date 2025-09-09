# LeetCode Progress Tracker

A full-stack web application designed to help users track their LeetCode problem-solving progress, with administrative oversight capabilities.

## 🚀 Technology Stack

- **Backend**: Spring Boot, Spring Security, REST APIs  
- **Frontend**: React.js  
- **Database**: PostgreSQL  
- **Version Control**: Git, GitHub  
- **Authentication**: Spring Security-based authentication system  
- **Containerization**: Docker  
- **CI/CD**: GitHub Actions  
- **Deployment**: AWS ECS Fargate, AWS Load Balancer 

## 📋 Key Functionalities

### Administrative Features

**User Management**
- View all system users with comprehensive details (username, email, LeetCode progress metrics)
- Select and examine individual user profiles and progress statistics
- User account management (deactivate/block users by username)

**Problem Assignment**
- Assign specific LeetCode problems to individual users by username
- Bulk assignment capability through JSON file uploads
- Targeted problem distribution to specific users

**Analytics & Reporting**
- System-wide statistics dashboard displaying:
  - Total user count
  - Total LeetCode problems in database
  - Aggregate problem status metrics (TODO, DOING, DONE across all users)
- Progress monitoring across the user base

### User Features

**Problem Management**
- Add new LeetCode problems to personal tracking list
- Update problem status through three-stage workflow (TODO → DOING → DONE)
- Edit problem information (name, description, direct link)
- Maintain personal problem repository

**Data Export**
- Generate and download problem lists in PDF format
- Export data to Excel spreadsheets for offline analysis
- Customizable report generation

### System Security & Integrity

**Access Control**
- Single administrator account restriction
- Role-based authentication system
- Protected administrative endpoints

**Data Validation**
- Unique username enforcement across the system
- Unique email address requirement
- Data consistency checks and validation

## 🔒 System Restrictions

- Exclusive single administrator configuration
- Multiple standard user accounts supported
- Unique identifier enforcement (username and email)
- Role-based access control implementation

## 🎯 Future Enhancements

**User Registration Workflow**
- Admin-approved signup request system
- User legitimacy verification process
- Registration approval/denial mechanism
- Enhanced security through managed onboarding

**Additional Planned Features**
- Advanced analytics and visualization
- Performance tracking and progress forecasting
- Social features and competitive elements
- Integration with LeetCode API for real-time verification
- Mobile application support

## 🏗️ Architecture

The application follows a modern microservices architecture with clear separation between:  
- RESTful API backend (Spring Boot)  
- Responsive frontend interface (React.js)  
- Secure database layer (PostgreSQL)  
- Authentication and authorization middleware (Spring Security)  
- Docker: for local containerization tool for developers
- GitHub Actions (CI/CD Pipeline): automates building Docker images and deploying them to ECS Fargate.
    > Details: 
    > - Uses the `Dockerfile` definition to build an image inside the GitHub Actions runner.
    > - Pushes that image to Amazon ECR.
    > - Deploys it to ECS Fargate.
- ECS Fargate = the runtime environment where containers run (pulled from ECR).
- AWS Load Balance: is used in front of ECS services for traffic distribution and scalability.

```text
[ Developer ]
    |
   (local Docker build & run for testing)
    |
    V
[ GitHub Actions Workflow ]
    |
   (build image using Dockerfile, push to ECR, deploy to ECS Fargate)
    |
    V
[ Amazon ECR ]
    |
   (stores container images)
    |
    V
[ AWS ECS Fargate ]
    |
   (runs containers as tasks from ECR)
    |
    V
[ AWS Load Balancer ]
    |
   (routes traffic & ensures scaling)
    |
    V
[ End Users ]

```


## 📊 Data Management

- Secure user data storage with encryption
- Efficient problem status tracking system
- Export functionality with multiple format support
- Bulk operations through file processing capabilities

---


This application provides a comprehensive solution for both individual LeetCode practice tracking and administrative oversight of multiple users' progress.
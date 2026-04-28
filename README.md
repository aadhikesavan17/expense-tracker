# Full-Stack Expense Tracker

A simple, beautiful full-stack Expense Tracker application. 

## Features

- **User Authentication**: Secure register and login system.
- **Transaction Management**: Add, edit, and delete income/expenses.
- **Dynamic Dashboard**: View total income, expense, and balance summaries.
- **Filtering**: Filter your transactions by month and year.
- **Premium Design**: Built with vanilla CSS using a modern glassmorphic aesthetic.

## Technology Stack

- **Frontend**: React (Vite), Axios, React Router, Lucide Icons
- **Backend**: Spring Boot (Java 17), Spring Web, Spring Data JPA, Hibernate
- **Database**: MySQL

---

## Setup Instructions

### 1. Database Setup

1. Make sure you have MySQL installed and running on your machine (default port `3306`).
2. Run the provided `schema.sql` script to create the database and tables:
   ```bash
   mysql -u root -p < schema.sql
   ```
   *Note: If your MySQL username or password is not `root`, please update `expense-tracker-backend/src/main/resources/application.properties` accordingly.*

### 2. Backend Setup (Spring Boot)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd expense-tracker-backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(If you are on Windows, use `mvnw.cmd spring-boot:run`)*
   
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd expense-tracker-frontend
   ```
2. Install the necessary dependencies (already included in package.json):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will be accessible at the URL provided in your terminal (usually `http://localhost:5173`).

---

## API Endpoints List

### Users
- `POST /api/users/register` - Create a new user account.
- `POST /api/users/login` - Authenticate an existing user.

### Transactions
- `POST /api/transactions` - Add a new transaction (income/expense).
- `PUT /api/transactions/{id}` - Edit an existing transaction.
- `DELETE /api/transactions/{id}` - Delete a transaction.
- `GET /api/transactions?userId={id}&month={month}&year={year}` - Retrieve user transactions, optionally filtered by month and year.
- `GET /api/transactions/dashboard?userId={id}` - Retrieve the financial summary for the dashboard.

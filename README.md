# Sports E-Commerce API

## Project Description
Sports E-Commerce API is the backend part of the Sports project, an e-commerce application developed to sell products related to physical exercises and sports. This API was built using Node.js and Express, and it interacts with a MongoDB database to manage user, product, and order data.

## Features
- User management (account creation, login)
- Product management
- Order processing
- Integration with Stripe for fictitious payments

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose (for data modeling)
- Stripe (for payments)
- JWT (for authentication)

## How to Run the API

### Prerequisites
- Node.js installed
- MongoDB running
- Stripe account to obtain API keys

### Step by Step
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/sports-ecommerce-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd sports-ecommerce-api
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file at the root of the project and add the necessary environment variables:
    ```
    STRIPE_SECRET=<your-stripe-secret-key>
    MONGODB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```
5. Start the API using Nodemon:
    ```bash
    npx nodemon index.js
    ```
6. The API will be available at:
    ```
    http://localhost:3000
    ```

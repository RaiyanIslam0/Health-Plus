# LeMickey
### The Ultimate Health and Wellness App
https://lemickey-hi.vercel.app


## Overview

This Project Focuses on making a user friendly application for meal logging, calorie + macronutrient tracking, meal planning, and daily progress monitoring. Since with each day there is a rise in health-conscious lifestyles, the need for tools that enable users to easily log their meals, monitor their nutritional intake, and set dietary goals tailored to their health and fitness objectives also will increase by the same margin. Although many apps already exist in this space, there are usually bad and also added with a non intuitive interface, really high subscription costs, or the just won't offer a comprehensive set of features like this project: Easy Meal Logging, Calorie/Macros Tracking, Simple Meal Planner, Recipe Storage + Creation, Nutrient Insights, Progress Tracking and Finally Daily Reminders all in one place. The aim of this project is to simplify the user experience while at the same time being able to provide all necessary features in a simple and great platform.

## Webapp access:

To use the fully functional web app just visit the link: https://lemickey-hi.vercel.app

Deployed Frontend Link: https://lemickey-hi.vercel.app

- We deployed out frontend using vercel.



Deployed Backend Link: https://lemickey-hi.onrender.com

- We deployed are backend using render.

No need to setup local environment to test this link it is already deployed, but I still provided local setup if anyone wants to test.

## Features

User Registration and Authentication:
Users can register, log in, and securely manage their accounts.


Nutrition Tracking:
Add and monitor daily food intake with detailed nutritional data.


Exercise Logging:
Search and log exercises with automatic calorie burn calculations.


Recipe Suggestions and creation:
Discover and log healthy recipes tailored to your goals.


Note and reminder:
To give users more usability

## Technologies Used
### Frontend:
React, Chakra UI
### Backend:
Node.js, Express.js
### Database:
MongoDB
### APIs:
nutritionix API, theMealDB API
### State Management:
Redux
### Routing:
React Router


## Setup and Installation

### Prerequisites
Node.js and npm installed.

MongoDB server running locally or in the cloud.


### Steps to Run Locally
- Clone the repository:

- git clone https://github.com/yourusername/your-repo.git

- Navigate to the project directory:

- cd your-repo/client
- cd  your-repo/server

- Install dependencies:

- npm install

### Set up environment variables in the backend:

Create a .env file in the root directory with the following variables:

- PORT=5000

- MONGODB_URI=your_mongodb_connection_string

- NUTRITIONIX_APP_ID=your_api_key

- NUTRITIONIX_API_KEY=your_api_key

- JWT_SECRET=your_api_key

- Toke=your_token

### Start the development server:

npm start in both client and server

Open your browser and navigate to http://localhost:3000.


## How to Use

Sign Up/Log In:

Register as a new user or log in to your account.

Track Nutrition:

Add meals or ingredients to calculate nutritional intake.

Log Exercises:

Search for exercises and track calories burned.

Discover Recipes and also create:

Browse recipes and add them to your daily log.


Note: Sometimes some features take two clicks to add so if the error pops up it just some state managment issue when we deployed however, if you click it the second time it will work. For example, when adding food you most likely will need to click Add to {meal} twice.

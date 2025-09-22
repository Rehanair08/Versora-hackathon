# Versora - Personalised Learning App 
## Table of Contents 
- [Description](#description)
- [About the app](#about-the-app)
- [Deployment](#deployment)
- [Installation](#installation)
## Description 
This project is build using next.js frontend and backend. It provides a reactive real-time platform for personlised learning. The functionning of the app is provided by Google API keys. The app helps people to learn according to their pace, and interests. It tracks their courses, quizes them in it and even tracks their progress and streaks for additional motivation. 
## About the app
The first page of the website is the landing page, the user can login with username, password, gmail or can opt to login as a guest. The database handling for usernames and gmails is done by supabase. The next page is a **personalisation quiz** about their interests etc,. The user will be then directed to the dashbaord which contains streaks, courses enrolled etc,. A recommendation system using their insterests is visible under "courses" tab in left bar. The person may enroll in any of the courses. The courses are enabled using Youtube API. The app enables the person to quiz on the course taken in three different levels - beginner, intermediate and then advanced.
Additionaly the app also provides a quiz on anything tab as well, which is provided using Google Gemini API. This API key enables to quiz on anything with three different levels and custom questions as well. These marks are tarcked by a progress tracker and is visible in the progress bar from the left. 
A progress graph with the quizes taken is tracked in the progress tab as well. The user may also choose to resume their journey in the course from the progress tab as well. 
<img width="1919" height="875" alt="image" src="https://github.com/user-attachments/assets/98a8d907-8bd8-46c7-9545-9d5edab1c153" />
The above image provides the view into the dashboard of the app. 
<img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/2e1a01a8-dc0d-4892-b642-5a4eee4db607" />
The above image gives a glimpse toward the courses page of the web app. This helps the user to select and enroll in courses from youtube API. 
<img width="1919" height="833" alt="image" src="https://github.com/user-attachments/assets/7a82f15a-8207-4ed2-a646-091e1ed21eb3" />
The quiz page, provides two option as stated above - quiz on anything and quiz on courses taken. The quiz page is enabled by google gemini API. Further more, the app also provides gmail updates about the new highest score etc,. This is enabled by Google Gmail API. 
<img width="1895" height="863" alt="image" src="https://github.com/user-attachments/assets/e53bfd9b-1758-4a89-b41f-690114cafb27" />
The progress bar also contains a graph as stated above for a more user friendly approach. The settings page however, allows the person to change their passwords, usernames etc,. 
Hence, Versora provides a new-age personalisation learning app. 
## Deployment 
The app is hosted in versel and can be accessed using this URL: 
https://v0-personalized-learning-app-delta.vercel.app/
## Installation 
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: Copy `.env.example` to `.env` and fill in the required values.

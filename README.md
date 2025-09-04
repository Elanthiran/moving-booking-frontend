## 🎬 moving booking frontend (React + Redux)
This is the frontend for the Movie Ticket Booking Application. It provides a user-friendly interface for browsing movies, selecting theatres, booking seats, and managing orders. 

--- 

## 🚀 Features
🏙️ City Selection
- Choose your city and view available movies
🎥 Movies & Shows
- Browse movies playing in selected city
- View theatres and available showtimes
💺 Seat Booking
- Dynamic seat layouts per theatre
- Select seats, view availability in real-time
-  Booking summary page
🔑 Authentication
- user registration & login (JWT)
-  Google OAuth login - Role-based access (user/admin)
📦 Orders
- Checkout and confirm bookings
-  View past orders and booking details

 ---
  
  ## 🛠️ Tech Stack 
  - React + Vite
  -  Redux Toolkit (state management)
  -  Axios (API calls)
  -  Bootstrap (UI styling)
  -   React Router (navigation)
 ---
 
## Project-structure
frontend-movie /
|--src
| |--components 
| | |--AuthPage.jsx
| | |--GoogleLoginButton.jsx
| | |--Logout.jsx
| | |--ProtectedRoute.jsx
| |--Pages
| | |--AddShow.jsx
| | |--BookingPage.jsx
| | |--Bookingseats.jsx
| | |--BookTickets.jsx
| | |--Location.jsx
| | |--MovieDetails.jsx
| | |--Movies.jsx
| | |--MoviesView.jsx
| | |--OrderDetails.jsx
| | |--OrderList.jsx
| | |--PaymentPage.jsx
| | |--Terms.jsx
| | |--Theatre.jsx
| |--Redux
| | |--slice
| | | |--authSlice.js
| | | |--CartSlice.js
| | | |--movieSlice.js
| |--services
| | |--authServices.jsx
| |--utils
| | |--formatters.jsx
| |--App.jsx
| |--App.css

---
## ⚡ Installation & Setup 1️⃣ Clone the repository
```bash
git clone https://github.com/Elanthiran/moving-booking-frontend.git
cd moving-booking-frontend
```
2️⃣ Install dependencies
```bash
npm install
```
3️⃣ Run the development server
```bash
npm run dev
```
---

## 👨‍💻 Usage 
-  Select a City → Choose your city to see available movies.
-  Browse Movies → Click on a movie to view theatres & shows.
-  Book Seats → Select available seats and proceed to checkout.
-  Login/Register → Required to confirm booking.
-  Checkout → Confirm order and view booking summary.
-  View Orders → Access your past bookings in the Orders section.
---

 ## 🤝 Contributing
 Contributions are welcome! 
 🎉 To contribute: 
 - Fork this repository
 - Create a new branch(git checkout -b feature-name)
 -  Make your changes and commit(git commit -m "Added new feature")
 -   Push to your branch - git push origin feature-name
 -    Open a Pull Request 🚀

   ---

 ## ✅ Future Enhancements 
 - Online payment integration (Stripe/Razorpay) 
 - Real-time seat locking with WebSockets 
 - Admin dashboard for movie & theatre management 
      
      ---
      
 ## 📜 License 
      This project is licensed under the MIT License.

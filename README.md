## moving-booking-fronted

A movie booking application frontend built with **React**, **JavaScript**, **Redux**, and **Bootstrap**. This application allows users to browse movies, find showtimes, select seats, and view a booking summary.

---

## Features

- **City & Movies**: Users can select a city and see a list of movies currently playing in that city.
- **Theatres & Shows**: By clicking a movie, users can see the available theatres and showtimes for that film.
- **Booking Seats**: The seat selection interface displays which seats are available, selected, and already booked.
- **Booking Summary**: A dynamic summary provides a real-time overview of the booking, including selected seats and total price.
- **Payment Page**:By choosing the payment Method for payment ,if payment has successful then the selected seats are booked .
- **Order List** :For viewing the orders in the login account till now
- **Order Details**:By clicking the orderdetails can view the booked seats and movie details

---
## Tech stack

- **React**: A JavaScript library for building the user interface.
- **JavaScript**: The core language for the application's logic.
- **Redux**: Used for state management to handle the complex application state (e.g., active city, selected movies, and booking details).
- **Bootstrap**: Provides a responsive and modern design for the application.

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

## Usage

1.  **Select a City**: Choose your preferred city from the dropdown or list on the home page.
2.  **Browse Movies**: The movie list will update to show films available in the selected city. Click on a movie to view its details.
3.  **Choose a Show**: On the movie details page, select a theatre and showtime.
4.  **Select Seats**: The seat layout will appear. Click on the seats you want to book.
5.  **Review Booking**: The booking summary will update as you select seats.
6.  **Confirm**: Proceed to the payment or confirmation screen to finalize your booking (assuming backend integration).

---

```bash
## Clone this Repo :
git clone https://github.com/Elanthiran/moving-booking-frontend.git
cd moving-booking-frontend
```
---
## Contributing 

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.
   
---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

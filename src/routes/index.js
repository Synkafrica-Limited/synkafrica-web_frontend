// // Import your page components here
// import HomePage from '../app/(main)/page';
// import ProfileScreen from '../components/dashboard/Sidebar';
// import BookingFlow from '../components/booking_flow/Booking_flow';
// import DiningBookingForm from '../components/booking_flow/DiningBookingForm';
// import ConvenienceBookingForm from '../components/booking_flow/ConvenienceBookingForm';
// import ExploreBeachSection from '../app/customer_landingpage/Expore_beaches';
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Export routes as an object or array for easy access
// export const routes = [
//   { path: '/', component: HomePage, name: 'Home' },
//   { path: '/profile', component: ProfileScreen, name: 'Profile' },
//   { path: '/bookings', component: BookingFlow, name: 'Bookings' },
//   { path: '/dining', component: DiningBookingForm, name: 'Dining' },
//   { path: '/convenience', component: ConvenienceBookingForm, name: 'Convenience Services' },
//   { path: '/beaches', component: ExploreBeachSection, name: 'Beaches' },
//   // ...add more routes as needed
// ];

// // Optionally, export as a map for direct access
// export const routeMap = {
//   home: HomePage,
//   profile: ProfileScreen,
//   bookings: BookingFlow,
//   dining: DiningBookingForm,
//   convenience: ConvenienceBookingForm,
//   beaches: ExploreBeachSection,
// };

// function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ...other routes */}
//         <Route path="/profile" element={<ProfileScreen />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRouter;
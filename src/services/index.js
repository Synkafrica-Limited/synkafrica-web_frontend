import authService from './authService';
import bookingsService from './bookings.service';
import listingsService from './listings.service';
import transactionsService from './transactions.service';
import businessService from './business.service';

export { authService, bookingsService, listingsService, transactionsService, businessService };

const services = {
  authService,
  bookingsService,
  listingsService,
  transactionsService,
  businessService,
};

export default services;

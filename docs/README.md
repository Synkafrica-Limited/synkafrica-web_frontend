# Micro-Interactions Components

This directory contains reusable micro-interaction components for notifications, confirmations, and user feedback throughout the application.

## Components Overview

### 1. Toast Notifications (`Toast.jsx`)
Temporary notification messages that appear at the top-right of the screen.

**Features:**
- 4 types: `success`, `error`, `warning`, `info`
- Auto-dismiss with configurable duration
- Smooth slide-in/slide-out animations
- Manual close button
- Stackable (multiple toasts)

**Usage:**
```jsx
import { useToast } from '@/hooks/useNotifications';
import { Toast } from '@/components/ui/Toast';

function MyComponent() {
  const { toasts, addToast, removeToast } = useToast();

  const handleSuccess = () => {
    addToast('Operation completed!', 'success', 3000);
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${1 + index * 5}rem` }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
      
      <button onClick={handleSuccess}>Show Toast</button>
    </>
  );
}
```

### 2. Confirmation Dialog (`ConfirmDialog.jsx`)
Modal dialog for confirming destructive or important actions.

**Features:**
- 3 types: `danger`, `warning`, `info`
- Loading state support
- Backdrop overlay
- Keyboard accessible
- Prevent close during loading

**Usage:**
```jsx
import { useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function DeleteComponent() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteItem();
    setIsDeleting(false);
    setShowConfirm(false);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
      
      <button onClick={() => setShowConfirm(true)}>Delete</button>
    </>
  );
}
```

### 3. Notification System (`Notifications.jsx`)
Complete notification system with badge, popup, and booking alerts.

**Components:**
- `NotificationBadge` - Bell icon with unread count
- `NotificationPopup` - Dropdown showing all notifications
- `BookingNotification` - Special toast for new bookings

**Usage:**

#### Notification Badge & Popup
```jsx
import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationBadge, NotificationPopup } from '@/components/ui/Notifications';

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();

  return (
    <header>
      <NotificationBadge
        count={unreadCount}
        onClick={() => setShowNotifications(true)}
      />

      {showNotifications && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
        />
      )}
    </header>
  );
}
```

#### Booking Notification
```jsx
import { useState } from 'react';
import { BookingNotification } from '@/components/ui/Notifications';

function Dashboard() {
  const [showBooking, setShowBooking] = useState(false);

  const bookingData = {
    customerName: "John Doe",
    serviceName: "Luxury SUV",
    price: "₦25,000",
    date: "Dec 15, 2024"
  };

  return (
    <>
      {showBooking && (
        <BookingNotification
          booking={bookingData}
          onClose={() => setShowBooking(false)}
          onView={() => {
            // Navigate to order details
            router.push('/dashboard/business/orders');
          }}
        />
      )}
    </>
  );
}
```

## Hooks

### `useToast()`
Manages toast notifications state.

**Returns:**
- `toasts` - Array of active toasts
- `addToast(message, type, duration)` - Add new toast
- `removeToast(id)` - Remove specific toast

### `useNotifications()`
Manages notification system state.

**Returns:**
- `notifications` - Array of notifications
- `unreadCount` - Number of unread notifications
- `addNotification(notification)` - Add new notification
- `markAsRead(id)` - Mark as read ('all' for all notifications)
- `removeNotification(id)` - Remove notification

## Real-World Integration

### WebSocket Integration
```jsx
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/notifications');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'new_booking') {
      // Show booking notification
      setBookingData(data);
      setShowBooking(true);

      // Add to notification list
      addNotification({
        type: 'booking',
        title: 'New Booking Order',
        message: `${data.customer_name} booked ${data.service_name}`,
      });
    }
  };

  return () => ws.close();
}, []);
```

### API Integration
```jsx
const handleDelete = async () => {
  setIsDeleting(true);
  
  try {
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    addToast('Listing deleted successfully', 'success');
  } catch (error) {
    addToast('Failed to delete listing', 'error');
  } finally {
    setIsDeleting(false);
    setShowConfirm(false);
  }
};
```

## Styling

All components use Tailwind CSS and include:
- Smooth animations (fade, slide, scale, bounce)
- Responsive design
- Accessible color schemes
- Loading states
- Dark mode support (future)

## Animation Keyframes

The components include custom CSS animations:
- `fadeIn` - Fade in backdrop
- `slideIn/slideOut` - Slide from right
- `slideInRight` - Slide notification popup
- `scaleIn` - Scale up dialog
- `bounce` - Bounce bell icon
- `pingOnce` - Pulse notification badge

## Best Practices

1. **Toast Notifications**
   - Use `success` for completed actions
   - Use `error` for failures
   - Use `warning` for caution messages
   - Use `info` for general information
   - Keep messages concise (< 100 characters)

2. **Confirmation Dialogs**
   - Use `danger` for destructive actions (delete, remove)
   - Use `warning` for important decisions
   - Use `info` for informational confirmations
   - Always show loading state during async operations
   - Disable close button during loading

3. **Notifications**
   - Limit notification count display (9+)
   - Auto-dismiss booking notifications after 8 seconds
   - Allow manual dismissal
   - Mark as read on view
   - Persist notifications (consider localStorage)

## File Structure

```
src/
├── components/
│   └── ui/
│       ├── Toast.jsx                    # Toast notification
│       ├── ConfirmDialog.jsx            # Confirmation modal
│       ├── Notifications.jsx            # Notification system
│       └── USAGE_EXAMPLES.js            # Code examples
└── hooks/
    └── useNotifications.js              # State management hooks
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Accessibility

- Keyboard navigation supported
- ARIA labels included
- Screen reader friendly
- Focus management
- Color contrast compliant

## Future Enhancements

- [ ] Sound notifications
- [ ] Persistent notifications (localStorage)
- [ ] Dark mode support
- [ ] Custom positioning
- [ ] Notification groups
- [ ] Action buttons in toasts
- [ ] Image/icon support in notifications
- [ ] Rich text formatting

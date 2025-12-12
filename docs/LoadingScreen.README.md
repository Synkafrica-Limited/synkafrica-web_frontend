# LoadingScreen Component

A modern, standardized loading screen component for consistent user experience across the application.

## Features

- **Multiple Variants**: Auth, Dashboard, Default, and specialized screens
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Professional loading animations with gradients and effects
- **Customizable**: Flexible props for different use cases
- **Accessible**: Proper ARIA labels and semantic HTML

## Usage

### Basic Usage

```jsx
import LoadingScreen from "@/components/ui/LoadingScreen";

// Default loading screen
<LoadingScreen />

// With custom message
<LoadingScreen message="Loading your data..." />
```

### Specialized Loading Screens

```jsx
import {
  AuthLoadingScreen,
  DashboardLoadingScreen,
  PageLoadingScreen,
  FormLoadingScreen
} from "@/components/ui/LoadingScreen";

// Authentication pages
<AuthLoadingScreen message="Signing you in..." />

// Dashboard loading
<DashboardLoadingScreen message="Preparing dashboard..." />

// General page loading
<PageLoadingScreen message="Loading content..." />

// Form submission
<FormLoadingScreen message="Submitting form..." />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | string | "Loading..." | Main loading message |
| `subtitle` | string | varies | Secondary descriptive text |
| `variant` | string | "default" | Screen variant: "default", "auth", "dashboard" |
| `showLogo` | boolean | true | Whether to show the logo/icon |
| `size` | string | "default" | Size variant: "small", "default", "large" |

### Variants

#### Default
- Clean, professional design
- Gradient background
- Animated spinner with pulsing ring
- Bouncing dots animation

#### Auth
- Enhanced for authentication flows
- Floating sparkle animations
- Shield icon with gradient
- More engaging visual elements

#### Dashboard
- Optimized for business dashboard
- Progress bar animation
- Professional card-style design
- Subtle background patterns

## Integration Examples

### Page Loading State

```jsx
const [loading, setLoading] = useState(true);

if (loading) {
  return <PageLoadingScreen message="Loading page..." />;
}

return <YourPageContent />;
```

### Form Submission

```jsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await submitForm();
  } finally {
    setSubmitting(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    {/* form fields */}
    <button disabled={submitting}>
      {submitting ? <FormLoadingScreen /> : "Submit"}
    </button>
  </form>
);
```

### Layout Loading

```jsx
// In layout components
if (sessionLoading) {
  return <DashboardLoadingScreen message="Loading dashboard..." />;
}
```

## Migration Guide

### From Old LoadingProvider

The `LoadingProvider` has been updated to use the new `LoadingScreen` component. Existing code using `useLoading()` will continue to work with improved visuals.

### From Inline Loading States

Replace custom loading implementations:

```jsx
// Before
{loading && (
  <div className="flex items-center justify-center p-8">
    <Spinner />
    <span>Loading...</span>
  </div>
)}

// After
{loading && <PageLoadingScreen message="Loading..." />}
```

### From Basic Spinners

```jsx
// Before
<div className="flex items-center justify-center h-screen">
  <Spinner size={40} />
</div>

// After
<DashboardLoadingScreen />
```

## Best Practices

1. **Use Appropriate Variants**: Choose the variant that matches your context
2. **Provide Meaningful Messages**: Use descriptive loading messages
3. **Consider Timing**: Only show loading screens for operations >500ms
4. **Test Responsiveness**: Ensure loading screens work on mobile devices
5. **Maintain Consistency**: Use the same loading patterns across similar contexts
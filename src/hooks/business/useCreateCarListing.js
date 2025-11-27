// hooks/business/useCreateCarListing.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useNotifications";
import { useBusiness } from "@/hooks/business/useBusiness";

export const useCreateCarListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

  // Fetch business data to get businessId
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  const createCarListing = async (formData, images) => {
    if (!token) {
      addToast("Authentication required. Please log in.", "error");
      return;
    }

    if (businessLoading) {
      addToast("Loading business information...", "info");
      return;
    }

    if (businessError) {
      addToast("Failed to load business information. Please try again.", "error");
      return;
    }

    if (!business) {
      addToast("Business account not found. Please create a business first.", "error");
      return;
    }

    console.log("Business data:", business); // Debug: Check business structure

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.carPlateNumber) {
        throw new Error("Car plate number is required");
      }

      if (!formData.location) {
        throw new Error("Pickup location is required");
      }

      // Extract city from location
      const extractCityFromLocation = (location) => {
        if (!location) return "Lagos";
        const parts = location.split(',');
        if (parts.length > 1) {
          return parts[0].trim();
        } else {
          const commonCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Benin', 'Enugu', 'Calabar'];
          const foundCity = commonCities.find(city => 
            location.toLowerCase().includes(city.toLowerCase())
          );
          return foundCity || 'Lagos';
        }
      };

      const extractedCity = extractCityFromLocation(formData.location);

      // Map transmission types to expected values
      const transmissionMap = {
        "Automatic": "AUTOMATIC",
        "Manual": "MANUAL"
      };

      // Map fuel types to expected values
      const fuelTypeMap = {
        "Petrol": "PETROL",
        "Diesel": "DIESEL", 
        "Electric": "ELECTRIC",
        "Hybrid": "HYBRID"
      };

      // Use the business ID from the business API response
      const businessId = business.id;
      
      if (!businessId) {
        throw new Error("Business ID not found. Please ensure you have a valid business account.");
      }

      // Prepare the request body according to the API endpoint
      const requestBody = {
        businessId: businessId,
        title: formData.vehicleName,
        description: formData.description,
        category: "CAR_RENTAL",
        basePrice: parseFloat(formData.pricePerDay),
        currency: "NGN",
        images: images.map((img) => img.preview),
        location: {
          address: formData.location,
          city: extractedCity,
          state: "", 
          country: "Nigeria"
        },
        carRental: {
          carMake: formData.brand,
          carModel: formData.model,
          carYear: parseInt(formData.year),
          carPlateNumber: formData.carPlateNumber,
          carSeats: parseInt(formData.seats),
          carTransmission: transmissionMap[formData.transmission] || formData.transmission,
          carFuelType: fuelTypeMap[formData.fuelType] || formData.fuelType,
          carFeatures: formData.features,
          chauffeurIncluded: formData.chauffeurIncluded,
          chauffeurPricePerDay: formData.chauffeurIncluded
            ? parseFloat(formData.chauffeurPrice || 0)
            : 0,
          chauffeurPricePerHour: formData.pricePerHour ? parseFloat(formData.pricePerHour) : 0,
          insuranceCoverage: true,
        }
      };

      console.log("Submitting car listing with businessId:", businessId, requestBody);

      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/listings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to create listing: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      addToast("Car rental listing created successfully!", "success");

      // Redirect after short delay to show toast
      setTimeout(() => {
        router.push("/dashboard/business/listings");
      }, 1000);

      return result;
    } catch (error) {
      console.error("Error creating car listing:", error);
      addToast(
        error.message || "Failed to create listing. Please try again.",
        "error"
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createCarListing,
    isSubmitting,
    businessLoading,
    businessError,
    business,
  };
};
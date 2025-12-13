import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/services/listings.service';

/**
 * Custom hook to fetch service detail by listing ID
 * @param {string} listingId - The ID of the listing to fetch
 * @returns {object} Query result with service data, loading, and error states
 */
export function useServiceDetail(listingId) {
  return useQuery({
    queryKey: ['service', listingId],
    queryFn: async () => {
      const response = await getListing(listingId);
      return response.data;
    },
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export default useServiceDetail;

export const fetchShop = async (shopId: string) => {
    try {
      const res = await fetch(`/api/shops/${shopId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch shop details");
      }
      return await res.json();
    } catch (error) {
      console.error("Error fetching shop:", error);
      return null;
    }
  };
  
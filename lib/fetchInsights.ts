export async function fetchInsights() {
    try {
      const res = await fetch("/api/insights", { cache: "no-store" }); // Disable caching for fresh data
      if (!res.ok) throw new Error("Failed to fetch insights");
      return await res.json();
    } catch (error) {
      console.error("Error fetching insights:", error);
      return null; // Handle errors gracefully
    }
  }
  
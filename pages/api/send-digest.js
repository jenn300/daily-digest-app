export default async function handler(req, res) {
  const apiKey = "83d3dd38e3bb4859bfbe8b09a8f6beed"; // Replace with your actual key
  const topic = "technology"; // You can change this to "nba", "lebron", "ai", etc.

  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(topic)}&language=en&pageSize=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "No articles returned" });
    }

    const headlines = data.articles.map((article) => ({
      title: article.title,
      summary: article.description || "",
      link: article.url
    }));

    res.status(200).json({ headlines });
  } catch (error) {
    console.error("News fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

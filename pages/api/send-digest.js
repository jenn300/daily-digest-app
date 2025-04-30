export default async function handler(req, res) {
  const apiKey = "83d3dd38e3bb4859bfbe8b09a8f6beed"; // your NewsAPI key

  const topics = [
    "canadian federal election",
    "nba",
    "venture capital",
    "technology canada",
    "us economy"
  ];

  const allHeadlines = [];
  const trustedDomains = "cbc.ca,cnn.com,bbc.co.uk,bloomberg.com,nytimes.com";

  for (const topic of topics) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      topic
    )}&language=en&sortBy=publishedAt&pageSize=4&domains=${trustedDomains}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.articles) {
        const topicHeadlines = data.articles.map((article) => ({
          topic,
          title: article.title,
          summary: article.description || "",
          link: article.url,
          source: article.source.name
        }));

        allHeadlines.push(...topicHeadlines);
      }
    } catch (error) {
      console.error(`Error fetching topic "${topic}":`, error);
    }
  }

  const top10 = allHeadlines.slice(0, 10);
  res.status(200).json({ headlines: top10 });
}

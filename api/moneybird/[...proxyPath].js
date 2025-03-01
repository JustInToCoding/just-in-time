export default async function handler(req, res) {
  const MONEYBIRD_API_URL = 'https://moneybird.com/api/';

  // Capture the full path after /api/proxy/
  const { proxyPath = [] } = req.query;
  const targetUrl = `${MONEYBIRD_API_URL}${proxyPath.join('/')}`; // Join array into URL

  try {
    // Forward headers (ensure API key is included)
    const headers = {
      ...req.headers,
    };

    // Forward the request to Moneybird
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // Read the response body as text (to handle both JSON and non-JSON errors)
    const text = await response.text();

    // Try to parse JSON, fallback to plain text if parsing fails
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    // Proxy the status code and response from Moneybird
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
}

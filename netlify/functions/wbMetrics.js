const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function(event, context) {
  const token = process.env.WB_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'No WB_TOKEN configured' })
    };
  }
  const params = new URLSearchParams(event.queryStringParameters || {});
  const dateFrom = params.get('dateFrom') || '';
  const url = `https://statistics-api.wildberries.ru/api/v1/supplier/sales${dateFrom ? '?dateFrom=' + encodeURIComponent(dateFrom) : ''}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'application/json'
      },
      body: text
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

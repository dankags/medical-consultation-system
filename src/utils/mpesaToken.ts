
export const generateMpesaToken = async (): Promise<string> => {
  const credentials = Buffer.from(
    `${process.env.M_PESA_CONSUMER_KEY}:${process.env.M_PESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `${process.env.MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate M-Pesa token');
  }

  const data = await response.json();
  return data.access_token;
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const initiateTransaction = async (data: { companyUEN: string; companyName: string }) => {
  const response = await fetch(`${API_BASE_URL}/bank-statement/initiateTransaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create bank statement');
  }

  return response.json();
};

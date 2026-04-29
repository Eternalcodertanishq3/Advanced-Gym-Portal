export function generateReceiptHTML(data: any): string {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Payment Receipt</h1>
      <p>Amount Paid: ${data.amount}</p>
      <p>Method: ${data.method}</p>
      <p>Date: ${data.date}</p>
    </div>
  `;
}


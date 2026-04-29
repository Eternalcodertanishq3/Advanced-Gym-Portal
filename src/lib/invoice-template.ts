export function generateInvoiceHTML(data: any): string {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Invoice #${data.id}</h1>
      <p>Amount: ${data.amount}</p>
      <p>Date: ${data.date}</p>
    </div>
  `;
}


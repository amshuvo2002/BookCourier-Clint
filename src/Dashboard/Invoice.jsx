export default function Invoices() {
  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">Invoices</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Payment ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Book Name</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-2">PAY987</td>
            <td className="border p-2">450</td>
            <td className="border p-2">2025-01-04</td>
            <td className="border p-2">JavaScript Basics</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function PatientBilling() {
    const bills = [
        { id: "#INV-2024-001", date: "2024-01-10", service: "General Consultation", amount: "$150", status: "Paid" },
        { id: "#INV-2024-002", date: "2024-01-12", service: "Blood Test (Seeded)", amount: "$85", status: "Pending" },
    ];

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Billing History</h2>
                <p className="text-gray-500 font-bold mt-1">Review your invoices and payment status for medical services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bills.map((bill) => (
                    <div key={bill.id} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Invoice Number</p>
                                <h3 className="text-xl font-black text-[#1F2B6C]">{bill.id}</h3>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${bill.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                {bill.status}
                            </span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Service Date</span>
                                <span className="text-[#1F2B6C]">{bill.date}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Description</span>
                                <span className="text-[#1F2B6C]">{bill.service}</span>
                            </div>
                            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                <span className="text-lg font-black text-[#1F2B6C]">Total Amount</span>
                                <span className="text-2xl font-black text-blue-600">{bill.amount}</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-gray-50 text-[#1F2B6C] font-black rounded-2xl hover:bg-[#1F2B6C] hover:text-white transition-all">
                            Download Receipt (PDF)
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

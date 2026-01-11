import { useState } from "react";

export default function DoctorBilling() {
    const stats = [
        { label: "Total Earnings", value: "$12,450", icon: "💰", color: "text-emerald-500 bg-emerald-50" },
        { label: "Pending Payout", value: "$1,200", icon: "⏳", color: "text-amber-500 bg-amber-50" },
        { label: "Consultation Fee", value: "$150", icon: "🎟️", color: "text-blue-500 bg-blue-50" },
    ];

    const transactions = [
        { id: "#TRX-9012", patient: "John Doe", date: "2024-01-10", amount: "$150", status: "Paid" },
        { id: "#TRX-9013", patient: "Jane Smith", date: "2024-01-11", amount: "$150", status: "Paid" },
        { id: "#TRX-9014", patient: "Michael Ross", date: "2024-01-12", amount: "$150", status: "Pending" },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-black text-[#1F2B6C]">Billing & Earnings</h2>
                <p className="text-gray-500 font-bold mt-1">Track your consultation revenue and payout history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(s => (
                    <div key={s.label} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl ${s.color}`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-[#1F2B6C]">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-xl font-black text-[#1F2B6C] mb-8">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                <th className="px-4 py-4">Transaction ID</th>
                                <th className="px-4 py-4">Patient</th>
                                <th className="px-4 py-4">Date</th>
                                <th className="px-4 py-4">Amount</th>
                                <th className="px-4 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map(t => (
                                <tr key={t.id} className="text-sm font-bold text-[#1F2B6C] hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-6 text-blue-600">{t.id}</td>
                                    <td className="px-4 py-6">{t.patient}</td>
                                    <td className="px-4 py-6 text-gray-400">{t.date}</td>
                                    <td className="px-4 py-6">{t.amount}</td>
                                    <td className="px-4 py-6">
                                        <span className={`px-4 py-1 rounded-full text-[10px] uppercase tracking-widest ${t.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

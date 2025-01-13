"use client";

import PayslipPage from "@/components/teams/payslip/page";
import { useParams } from "next/navigation";
import { usePDF } from 'react-to-pdf';


export default function UserPayslipPage() {
    const params = useParams();
    const userId = params?.userId;
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });


    if (!userId) {
        return <div>User ID not found</div>;
    }

    return (
        <div>
            <button className="mt-12" onClick={() => toPDF()}>Download PDF</button>
            <div ref={targetRef}>
                {/* <h1 className="text-2xl font-semibold mb-4">Payslip</h1> */}
                {/* <PayslipPage userId={userId} /> */}
            </div>
        </div>
    );
}

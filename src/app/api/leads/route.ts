import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/leads';
import { SendEmailOptions, sendEmail } from '@/lib/sendEmail';

export const dynamic = 'force-dynamic'; // Ensures the route is always dynamic

const sendWebhookNotification = async (phoneNumber: string, country: string, firstName: string, templateName: string,) => {
    const payload = {
        phoneNumber,
        country,
        bodyVariables: [firstName],
        templateName,
    };

    try {
        const response = await fetch('https://zapllo.com/api/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`Webhook API error: ${responseData.message}`);
        }
        console.log('Webhook notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending webhook notification:', error);
        throw new Error('Failed to send webhook notification');
    }
};

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, firstName, lastName, message, mobNo, subscribedStatus } = await request.json();

        if (!email || !firstName || !lastName || !mobNo || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

       

        const newLead = new Lead({ email, firstName, lastName, message, mobNo, subscribedStatus });
        await newLead.save();

        const emailOptions: SendEmailOptions = {
            to: email,
            cc: 'support@zapllo.com',
            subject: 'We have Received Your Inquiry',
            text: `Zapllo`,
            html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Thanks for Reaching Out!</h1>
</div>
 <div style="padding: 20px; color:#000000;">
               <p> Dear <strong>${firstName}</strong>,\n\n<p>Thank you for reaching out to Zapllo!</p></p>
               <p>Our team is already on it, and you can expect to hear back from us within the next 24 hours.In the meantime, feel free to explore our website to learn more about what we offer and how we can assist you.</p>\n\nThanks & Regards\n
               <p><strong>Team Zapllo</strong></p>
               </div>`,
        };
        await sendEmail(emailOptions);
        // Email to support with lead details (first name, last name, and message)
        const supportEmailOptions: SendEmailOptions = {
            to: 'support@zapllo.com',
            subject: 'New Lead Inquiry Received',
            text: `New Lead Inquiry`,
            html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
            <h1 style="margin: 0; font-size: 20px;">New Lead Inquiry Received</h1>
          </div>
           <div style="padding: 20px; color:#000000;">
             <p><strong>First Name:</strong> ${firstName}</p>
             <p><strong>Last Name:</strong> ${lastName}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>
               <p><strong>Subscribed Status:</strong></p>
             <p>${subscribedStatus}</p>
           </div>
        </div>
    </div>
  </body>`,
        };
        await sendEmail(supportEmailOptions);

        const mediaUrl = "https://res.cloudinary.com/dndzbt8al/image/upload/v1732650791/50_t0ypt5.png";
        const templateName = 'leadenquirycontactus_2g';
        try {
            await sendWebhookNotification(mobNo, "IN", firstName, templateName,);
        } catch (error) {
            console.warn("WhatsApp notification failed, but proceeding with response:", error);
        }
        // 6) PUBLIC CRM Contact & Lead creation
        //    Make sure you have the correct pipeline _id, stage, etc.
        const CRM_PIPELINE_ID = '67fccd4d766941bdf794b92c' // e.g. "64b0d3..."
        const CRM_FIRST_STAGE_NAME = 'New Leads'                          // or whatever stage is relevant
        const CRM_COMPANY_ID = '67fc08f621d4100351058362'           // from your question
        const CRM_ASSIGNED_TO = '67fa4aab3c2eea8c712b5861'          // from your question
        const CRM_SOURCE_ID = '67fcce22766941bdf794b9ee'       // if needed

        // A) Create the contact using the new "public" endpoint
        const contactPayload = {
            companyId: CRM_COMPANY_ID,
            firstName,
            lastName,
            email,
            country: 'IN',        // Hardcoded or from user input
            whatsappNumber: mobNo,
            state: '',
            city: '',
            pincode: '',
            address: '',
        }

        let createdContactId: string | null = null
        try {
            const contactRes = await fetch('https://crm.zapllo.com/api/public-contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactPayload),
            })

            const contactData = await contactRes.json()
            if (!contactRes.ok) {
                console.error('[CRM] Error creating contact:', contactData.error || contactData)
            } else {
                console.log('[CRM] Successfully created contact:', contactData)
                createdContactId = contactData._id
            }
        } catch (err) {
            console.error('[CRM] Unexpected error creating contact:', err)
        }

        // B) Create the lead in CRM if contact creation succeeded
        if (createdContactId) {
            const leadPayload = {
                pipeline: CRM_PIPELINE_ID,
                stage: CRM_FIRST_STAGE_NAME,
                title: firstName,   // e.g. "John"
                description: message,
                contact: createdContactId,
                assignedTo: CRM_ASSIGNED_TO,
                source: CRM_SOURCE_ID,       // e.g. "Zapllo" if you have a Source doc
                estimateAmount: 0,
                closeDate: null,
            }

            try {
                const leadRes = await fetch('https://crm.zapllo.com/api/public-leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leadPayload),
                })

                const leadData = await leadRes.json()
                if (!leadRes.ok) {
                    console.error('[CRM] Error creating lead:', leadData.error || leadData)
                } else {
                    console.log('[CRM] Successfully created lead:', leadData)
                }
            } catch (err) {
                console.error('[CRM] Unexpected error creating lead:', err)
            }
        }

        // 7) Return success to the original form
        return NextResponse.json({ message: 'Lead captured and CRM updated!' }, { status: 201 })
    } catch (error) {
        console.error('Error in POST /api/leads:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();
        const leads = await Lead.find({});
        return NextResponse.json(leads, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

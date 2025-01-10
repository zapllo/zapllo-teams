'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'

type Organization = {
  _id: string;
  companyName: string;
  industry: string;
  orgAdmin: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    whatsappNo: string;
  } | null; // OrgAdmin can be null if none is found
  trialExpires?: Date; // Add trialExpires field
};

export default function Workspaces() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [extensionDays, setExtensionDays] = useState(1); // State for tracking extension days

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('/api/organization/workspace');
        const formattedData = response.data.map((org: any) => ({
          _id: org._id,
          companyName: org.companyName,
          industry: org.industry,
          orgAdmin: org.users.length > 0 ? org.users[0] : null, // Fetch first orgAdmin if exists
          trialExpires: org.trialExpires ? new Date(org.trialExpires) : null, // Ensure trial expiration date is handled
        }));
        setOrganizations(formattedData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch organizations');
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Extend Trial Period Function
  const extendTrialPeriod = async (organizationId: string) => {
    try {
      const res = await axios.patch('/api/organization/admin', {
        organizationId,
        extensionDays,
      });
      const data = res.data;

      if (data.error) {
        alert(data.error);
      } else {
        alert('Trial period extended successfully');
        // Update the trial expiration date in the state
        setOrganizations((prevOrganizations) =>
          prevOrganizations.map((org) =>
            org._id === organizationId ? { ...org, trialExpires: new Date(data.data.trialExpires) } : org
          )
        );
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Revoke Trial Period Function
  const revokeTrialPeriod = async (organizationId: string) => {
    try {
      const res = await axios.patch('/api/organization/admin', {
        organizationId,
        revoke: true,
      });
      const data = res.data;

      if (data.error) {
        alert(data.error);
      } else {
        alert('Trial period revoked successfully');
        // Update the trial expiration date in the state
        setOrganizations((prevOrganizations) =>
          prevOrganizations.map((org) =>
            org._id === organizationId ? { ...org, trialExpires: data.data.trialExpires } : org
          )
        );
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workspaces</h1>
      <table className="min-w-full bg-gray-900 text-white">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="py-2 px-4">Organization Name</th>
            <th className="py-2 px-4">Org Admin</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">WhatsApp No</th>
            <th className="py-2 px-4">Trial Expires</th>
            <th className="py-2 px-4">Extend Days</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org._id} className="border-b border-gray-700">
              <td className="py-2 px-4">{org.companyName}</td>
              <td className="py-2 px-4">
                {org.orgAdmin ? `${org.orgAdmin.firstName} ${org.orgAdmin.lastName}` : 'No OrgAdmin'}
              </td>
              <td className="py-2 px-4">{org.orgAdmin?.email || 'N/A'}</td>
              <td className="py-2 px-4">{org.orgAdmin?.whatsappNo || 'N/A'}</td>
              <td className="py-2 px-4">{org.trialExpires ? org?.trialExpires?.toLocaleDateString() : 'N/A'}</td>
              <td className="py-2 px-4">
                <select
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  {[1, 7, 14, 30, 60, 90].map((days) => (
                    <option key={days} value={days}>
                      {days} {days > 1 ? 'Days' : 'Day'}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4 space-x-2">
                <Button onClick={() => extendTrialPeriod(org._id)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Extend Trial
                </Button>
                <Button onClick={() => revokeTrialPeriod(org._id)} variant="destructive">
                  Revoke Trial
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

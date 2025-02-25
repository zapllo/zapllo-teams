'use client'

import LeavesSidebar from '@/components/sidebar/leavesSidebar';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Import your breadcrumb components
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isLeaveAccess, setIsLeaveAccess] = useState<boolean | undefined>();
  const [isPlanEligible, setIsPlanEligible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const [userResponse, organizationResponse] = await Promise.all([
          axios.get('/api/users/me'),
          axios.get('/api/organization/getById'),
        ]);

        const user = userResponse.data.data;
        if (!user.isLeaveAccess) {
          router.push('/dashboard');
          return;
        }
        const organization = organizationResponse.data.data;
        // Define eligible plans
        const eligiblePlans = ['Money Saver Bundle'];



        setIsLeaveAccess(user.isLeaveAccess);

        // Determine if the leaves trial has expired
        const trialExpired =
          organization.leavesTrialExpires &&
          new Date(organization.leavesTrialExpires) <= new Date();

        // Determine if the subscription is valid
        const subscriptionValid =
          organization.subscriptionExpires &&
          new Date(organization.subscriptionExpires) > new Date();

        // Redirect if trial has expired and there is no valid subscription or subscribed plan
        if (trialExpired && (!organization.subscribedPlan || !subscriptionValid)) {
          router.push('/dashboard');
        }

        if (trialExpired) {
          // If the trial has expired, check for eligible plans
          const isPlanEligible = eligiblePlans.includes(organization.subscribedPlan);
          setIsPlanEligible(isPlanEligible);

          // Redirect if no eligible plan
          if (!isPlanEligible) {
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user or organization details:', error);
      }
    };

    checkAccess();
  }, [router]);


  useEffect(() => {
    const checkAccess = async () => {
      try {
        const [userResponse, organizationResponse] = await Promise.all([
          axios.get('/api/users/me'),
          axios.get('/api/organization/getById'),
        ]);

        const user = userResponse.data.data;
        const organization = organizationResponse.data.data;

        // Determine if the trial has expired
        const trialExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();

        // Determine if the subscription is valid
        const subscriptionValid = organization.subscriptionExpires && new Date(organization.subscriptionExpires) > new Date();

        // Redirect if trial has expired and there is no valid subscription or subscribed plan
        if (trialExpired && (!organization.subscribedPlan || !subscriptionValid)) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user or organization details:', error);
      }
    };

    checkAccess();
  }, [router]);

  // Generate breadcrumb items based on the current pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { title: 'Home', href: '/dashboard' } // Always start with Home
  ];
  let cumulativePath = '';
  segments.forEach((segment) => {
    cumulativePath += `/${segment}`;
    // Capitalize the first letter of the segment for display
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({ title, href: cumulativePath });
  });

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#04061e]">
      {/* Sidebar */}
      <div className="w-48 shrink-0">
        <LeavesSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow scrollbar-hide overflow-auto">
        <div className="p-4 mt-14">
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <BreadcrumbItem key={item.href}>
                    {isLast ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                    )}
                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Content */}
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/dashboardService";
import ParticipantsTable from "../../components/tables/ParticipantsTable";
import StudiesTable from "../../components/tables/StudiesTable";
import ApplicationsTable from "../../components/tables/ApplicationsTable";
import { getCurrentUserFromToken } from "../../auth/jwt";
import type { User } from "../../types/user";
import type { DashboardStats } from "../../types/dashboard";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudies: 0,
    totalApplications: 0,
    totalParticipants: 0,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchDashboardStats();
        setStats(data);
        const currentUser = getCurrentUserFromToken();
        setCurrentUser(currentUser);
      } catch (err) {
        setError("Failed to load dashboard statistics.");
        console.log("Error fetching dashboard stats:", error);

      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);
  return (
    <>
      <PageMeta
        title="Research Registry Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics
            totalStudies={stats.totalStudies}
            totalApplications={stats.totalApplications}
            totalParticipants={stats.totalParticipants}
            loading={loading}
          />
          <ParticipantsTable />
          <StudiesTable />
          <ApplicationsTable currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}

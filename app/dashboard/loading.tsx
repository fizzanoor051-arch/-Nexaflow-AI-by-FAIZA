import Loading from "@/components/ui/Loading";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading
        size="lg"
        text="Loading your workspace..."
      />
    </div>
  );
}
import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>; // Changed type
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return RedirectToSignIn({});
  }

  const { serverId } = await params;

  const server = await db.server.findUnique({
    where: {
      id: serverId, 
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="!hidden md:!flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} /> {/* Use the awaited value */}
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;

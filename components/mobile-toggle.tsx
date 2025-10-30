import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[320px] sm:w-[400px]">
        <div className="flex h-full">
          <div className="w-[72px] bg-[#1E1F22]">
            <NavigationSidebar />
          </div>
          <div className="flex-1 bg-[#2B2D31]">
            <ServerSidebar serverId={serverId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

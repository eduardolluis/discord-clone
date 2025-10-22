"use client";
import { PlusIcon } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const {onOpen} = useModal();
  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">
        <button className="group flex items-center" onClick={()=>onOpen("CREATE_SERVER")}>
          <div className="flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-neutral-700 light:bg-white-700 group-hover:bg-emerald-500 cursor-pointer">
            <PlusIcon
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

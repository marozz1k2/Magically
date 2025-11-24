import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface HiggsMotion {
    id: string;
    name: string;
    media: {
        width: number;
        height: number;
        url: string;
        type: string;
    };
    priority: number;
    tags: string[];
    preset_family: string;
    cms_id: string | null;
    categories: string[];
    params: {
        steps: number;
        frames: number;
        strength: number;
        guide_scale: number;
    };
}

const getHiggsfieldMotions = async () => {
  const res = await api.get("/higgsfield/motions");
  console.log("RAW RESPONSE FROM HOOK:", res.data);
  return res.data.data.data.items;
};

export const useHiggsfieldMotions = () => {
    return useQuery({
        queryKey: queryKeys.higgsfield.motions(),
        queryFn: getHiggsfieldMotions,
        staleTime: 1000 * 60 * 5,
    });
};

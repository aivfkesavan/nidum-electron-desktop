import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { crawleWeb, deletedCrawledLinks, getCrawledLinks } from "../actions/webcrawler";
import useContextStore from "../store/context";
import { groupLinks } from "../utils/url-helper";
import { useToast } from "../components/ui/use-toast";

export function useCrawler() {
  const projectId = useContextStore(s => s.project_id)

  return useQuery({
    queryKey: ["get-crawled-list", projectId],
    queryFn: () => getCrawledLinks(projectId),
    enabled: !!projectId,
    select: res => groupLinks(res),
  })
}

export function useAddCrawl() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: crawleWeb,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["get-crawled-list"] })
      toast({
        title: "Page(s) successfully crawled"
      })
    }
  })
}

export function useDeleteCrawledLinks() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deletedCrawledLinks,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["get-crawled-list"] })
      toast({
        title: "Deleted selected links"
      })
    }
  })
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Configurations from "./configurations";
import Instructions from "./instructions";
import Manage from "../../model/ollama/manage";

const tabs = ["Configurations", "Manage Models", "Instructions"]

function index() {
  return (
    <Tabs defaultValue="Configurations" className="mt-6">
      <TabsList className="mb-2 bg-transparent">
        {
          tabs.map(tab => (
            <TabsTrigger
              value={tab}
              key={tab}
              className="px-3.5 rounded-none text-white/70 border-b-2 data-[state=active]:text-white data-[state=active]:border-white/80"
            >
              {tab}
            </TabsTrigger>
          ))
        }
      </TabsList>

      <TabsContent value="Configurations">
        <Configurations />
      </TabsContent>

      <TabsContent value="Manage Models">
        <Manage filterFn={m => m?.details?.family?.includes("bert")} />
      </TabsContent>

      <TabsContent value="Instructions">
        <Instructions />
      </TabsContent>
    </Tabs>
  )
}

export default index

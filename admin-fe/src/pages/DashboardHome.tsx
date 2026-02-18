import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes, Coins, RefreshCcw, Users } from "lucide-react";


const DashboardHome = () => {
  return (
    <div id="home" className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="System status and recent recycling activity."
      />
      
      {/* Cards */}
      <div className="grid grid-cols-4 gap-5">
        <Card>
          <CardContent className="flex flex-col items-start gap-1">
            <div className="p-2.5 bg-blue-50 rounded-md mb-2">
              <Users size={28} strokeWidth={2} className="text-blue-500"/>
            </div>
            <p className="text-xs font-bold text-muted-foreground/80">TOTAL RESIDENTS</p>
            <p className="font-bold text-2xl tracking-tighter">15</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-start gap-1">
            <div className="p-2.5 bg-green-50 rounded-md mb-2">
              <Boxes size={28} strokeWidth={2} className="text-green-500"/>
            </div>
            <p className="text-xs font-bold text-muted-foreground/80">TOTAL MATERIALS</p>
            <p className="font-bold text-2xl tracking-tighter">15 kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-start gap-1">
            <div className="p-2.5 bg-yellow-50 rounded-md mb-2">
              <Coins size={28} strokeWidth={2} className="text-yellow-500"/>
            </div>
            <p className="text-xs font-bold text-muted-foreground/80">TOTAL POINTS EARNED</p>
            <p className="font-bold text-2xl tracking-tighter">1325</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-start gap-1">
            <div className="p-2.5 bg-purple-50 rounded-md mb-2">
              <RefreshCcw size={28} strokeWidth={2} className="text-purple-500"/>
            </div>
            <p className="text-xs font-bold text-muted-foreground/80">REWARDS REDEEMED</p>
            <p className="font-bold text-2xl tracking-tighter">15</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock */}
      

    </div>
  );
};

export default DashboardHome;

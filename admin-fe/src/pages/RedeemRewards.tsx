import PageHeader from "@/components/shared/PageHeader";
import type { RecordInterface } from "@/types/dto";
import { useState } from "react";
import SearchRecord from "./redeemRewards/SearchRecord";
import AvailableRewards from "./redeemRewards/AvailableRewards";

const ExchangeItems = () => {
  const [selectedRecord, setSelectedRecord] = useState<RecordInterface | null>(
    null,
  );

  return (
    <div id="redeem_points" className="space-y-8">
      <PageHeader
        title="Redeem Reward"
        description="Redeem accumulated points for community products and rewards"
      />

      {/* Search */}
      <SearchRecord
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      />

      {/* Available Rewards */}
      {selectedRecord && <AvailableRewards selectedRecord={selectedRecord} />}
    </div>
  );
};

export default ExchangeItems;

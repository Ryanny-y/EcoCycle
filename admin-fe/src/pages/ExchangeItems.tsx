import PageHeader from "@/components/shared/PageHeader";
import type { RecordInterface } from "@/types/dto";
import { useState } from "react";
import SearchRecord from "./exchangeItem.tsx/SearchRecord";

const ExchangeItems = () => {
  const [selectedRecord, setSelectedRecord] = useState<RecordInterface | null>(
    null,
  );

  return (
    <div id="exchange_items" className="space-y-8">
      <PageHeader
        title="Exchange Items"
        description="Exchange accumulated points for community products and rewards"
      />

      {/* Search */}
      <SearchRecord
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      />
    </div>
  );
};

export default ExchangeItems;

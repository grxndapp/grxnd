'use client'
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type MultiSelectRowProps = {
   items: any[];
   itemDisplay: (item: MultiSelectRowProps['items'][number]) => React.ReactNode;
   onSelect: (items: MultiSelectRowProps['items']) => void;
   searchKey?: string;
   itemStyle?: React.CSSProperties;
}

function CheckMark ({ checked }: { checked: boolean }) {
   return <div
      className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
      style={{
         backgroundColor: checked ? "var(--accent-color)" : "white",
         border: `1px solid ${checked ? "var(--accent-color)" : "#e0e0e0"}`,
         color: "white", borderRadius: "7px"
      }}
   ><Check size={15} /></div>
}

export default function MultiSelectRow({ items, itemDisplay, onSelect, searchKey, itemStyle }: MultiSelectRowProps) {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedItems, setSelectedItems] = useState<number[]>([]);

   function applySearchFilter () {
      return items.filter(item => item[searchKey! || "name"].toLowerCase().includes(searchQuery.toLowerCase()));
   }

   function toggleSelected (item: MultiSelectRowProps['items'][number]) {
      const originalIndex = items.indexOf(item);
      if (selectedItems.includes(originalIndex)) {
         setSelectedItems(prev => ([ ...prev.filter(i => (i !== originalIndex)) ]));
      } else {
         setSelectedItems(prev => ([ ...prev, originalIndex ]));
      }
   }

   useEffect(() => {
      onSelect(selectedItems.map(itemIndex => (items[itemIndex])));
   }, [selectedItems])

   return (
      <div className="multi-select-row">
         <div className="box full pd-05">
            <input 
               type="text" className="xxxs pd-11 pdx-15 radius-15 full mw-600"
               placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="multi-select-items">
            {applySearchFilter().map((item, index) => (
               <div key={index} style={itemStyle || {}} className="multi-select-item" onClick={() => toggleSelected(item)}>
                  <div className="box fit dfb align-center">
                     <CheckMark checked={selectedItems.includes(items.indexOf(item))} />
                  </div>
                  <div className="item-info">{itemDisplay(item)}</div>
               </div>
            ))}
         </div>
      </div>
   )
}

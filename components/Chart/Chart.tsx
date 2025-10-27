'use client'
import { useEffect, useState } from 'react';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

type ChartProps = {
   data: any;
   yDataKey: string;
   xDataKey: string;
   xAxisInterval?: number;
}

export default function Chart({ data, yDataKey, xDataKey, xAxisInterval }: ChartProps) {
   const [width, setWidth] = useState(500)
   const [height, setHeight] = useState(250)

   function getDeviceType(navgtr: Navigator): 'mobile' | 'desktop' {
      const ua = navgtr.userAgent;
      if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
         return 'mobile';
      } else {
         return 'desktop';
      }
   }

   useEffect(() => {
      if (getDeviceType(navigator) == "mobile") {
         setHeight(200)
         setWidth(300)
      } else {
         setHeight(250)
         setWidth(500)
      }
   }, [])
   
   return (
      <AreaChart width={width} height={height} data={data} margin={{ left: -60, right: 10 }}>
         <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1131ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1131ff" stopOpacity={0} />
            </linearGradient>
         </defs>

         <Area 
            type="monotone" 
            dataKey={yDataKey} 
            stroke="#1131ff" 
            fill="url(#colorUsers)"
            strokeWidth={2} 
            dot={false}
         />

         <XAxis dataKey={xDataKey} padding={{ left: 15 }} tick={{ fontSize: '0.9rem' }} interval={xAxisInterval!} />
         <YAxis dataKey={yDataKey} tick={false} tickLine />
         
         <CartesianGrid verticalValues={data.flatMap((dt: any) => dt.amount)} />
         
         <Tooltip cursor={{
            strokeWidth: 0.5,
            stroke: "#e6e6e6ff"
         }} />
      </AreaChart>
   )
}
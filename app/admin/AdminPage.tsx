"use client"
import { useEffect, useState } from "react";
import { chartCurrentMonth, chartGroupByMonth, chartLast7Days, chartTodayHourly, getUniqueYears } from "@/utils/chart";
import { useSession } from "next-auth/react";
import { pluralSuffixer } from "@/lib/str";
import { NormalCardStyles, UserCardStyles } from "@/styles-extra/styles";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import Chart from "@/components/Chart/Chart";
import Selections from "@/components/Selections/Selections";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

type AdminPageProps = {
   usersGraph: {
      name: string;
      email: string;
      userid: string;
      oauth_provider: string;
      is_subscribed: boolean;
      createdAt: Date;
   }[]
}

export default function AdminPage ({ usersGraph }: AdminPageProps) {
   const { data: session } = useSession();
   const [chartLabels, setChartLabels] = useState<string[]>([])
   const [chartLabelIndex, setChartLabelIndex] = useState(0)
   const [chartData, setChartData] = useState<any[]>([])
   const [chartDataXAxis, setChartDataXAxis] = useState("hour")
   const [chartXAxisInterval, setChartXAxisInterval] = useState(3)
   
   useEffect(() => {
      setChartLabels((prev) => [ 'Today', 'Last 7 days', 'This Month', ...getUniqueYears(usersGraph) ]);
      setChartData(chartTodayHourly(usersGraph))
      setChartDataXAxis("hour")
      setChartXAxisInterval(3)
   }, [])

   useEffect(() => {
      if (getUniqueYears(usersGraph).includes(chartLabels[chartLabelIndex!])) {
         setChartData(chartGroupByMonth(usersGraph, parseInt(chartLabels[chartLabelIndex])))
         setChartDataXAxis("month")
         setChartXAxisInterval(2)
      } else if (chartLabels[chartLabelIndex!] == "This Month") {
         setChartData(chartCurrentMonth(usersGraph))
         setChartDataXAxis("day")
         setChartXAxisInterval(5)
      } else if (chartLabels[chartLabelIndex!] == "Today") {
         setChartData(chartTodayHourly(usersGraph))
         setChartDataXAxis("hour")
         setChartXAxisInterval(3)
      } else if (chartLabels[chartLabelIndex!] == "Last 7 days") {
         setChartData(chartLast7Days(usersGraph))
         setChartDataXAxis("date")
         setChartXAxisInterval(1)
      }
   }, [chartLabelIndex])

   function filterUsersBySubscription (subscription: boolean) {
      return usersGraph.filter(user => (user.is_subscribed == subscription));
   }

   function filterUsersByOauth (oauth: string) {
      return usersGraph.filter(user => (user.oauth_provider.includes(oauth)));
   }

   return (
      <AppWrapper>
         <div className="box full pd-3">
            <div className="text-xxl bold-700 full">Admin Dashboard</div>
            <div className="text-xs full pd-1">Welcome to the Admin Page {session?.user?.name}</div>

            <div className="box full pd-2 dfb column gap-10">
               <Card styles={{
                  width: "100%", height: "fit-content", padding: "15px", borderRadius: "25px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
               }}>
                  <div className="text-m bold-700 full pd-1 pdx-15">User Chart</div>
                  <div className="box full pdx-15 mb-2">
                     <Selections 
                        selections={[ 'Today', 'Last 7 days', 'This Month', ...getUniqueYears(usersGraph) ]}
                        onSelect={(index: any) => setChartLabelIndex(index)}
                        defaultInitialIndex={0}
                     />
                  </div>
                  <Chart 
                     data={chartData} 
                     yDataKey="totalUsers" 
                     xDataKey={chartDataXAxis} 
                     xAxisInterval={chartXAxisInterval}
                  />
               </Card>
            </div>

            <div className="box full pd-2 dfb column gap-10">
               <Card styles={{ width: "100%", padding: "25px", borderRadius: "25px" }}>
                  <div className="text-xxs full">Current Users</div>
                  <div className="text-xxl bold-700 full accent-color">{usersGraph.length}</div>
                  <div className="text-xxxs full pd-1">
                     <b className="accent-color">{filterUsersBySubscription(true).length}</b> subscribed {pluralSuffixer('user', filterUsersBySubscription(true).length)}
                  </div>
                  <div className="text-xxxs full">
                     <b className="accent-color">{filterUsersBySubscription(false).length}</b> non-subscribed {pluralSuffixer('user', filterUsersBySubscription(false).length)}
                  </div>
               </Card>
            </div>
            
            <Card styles={NormalCardStyles}>
               <div className="box pd-1 full dfb column gap-10">
                  <div className="text-m full bold-600">Authentication</div>
                  <div className="box full dfb column gap-5">
                     <div className="text-s bold-600">Google Auth</div>
                     <ProgressBar percentage={(filterUsersByOauth("google").length/usersGraph.length)*100} />
                  </div>
                  <div className="box full dfb column gap-5">
                     <div className="text-s bold-600">Credentials Auth</div>
                     <ProgressBar percentage={(filterUsersByOauth("credentials").length/usersGraph.length)*100} />
                  </div>
               </div>
            </Card>
            <Spacing />
            
            <Card styles={{ ...NormalCardStyles, padding: "30px" }}>
               <div className="text-m full bold-600">All Users</div>
               <div className="text-xxs pd-1 full">All the wonderful users of Grxnd</div>
               <div className="box full dfb wrap gap-10">
                  {usersGraph.map(user => (
                     <div key={user.userid} style={UserCardStyles}>
                        <div className="text-s bold-600 full accent-color">{user.name}</div>
                        <div className="text-xxs full grey-5">{user.email}</div>
                     </div>
                  ))}
               </div>
            </Card>

            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}

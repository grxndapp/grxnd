"use client"
import { useEffect, useState } from "react";
import { chartCurrentMonth, chartGroupByMonth, chartLast7Days, chartTodayHourly, getUniqueYears } from "@/utils/chart";
import { useSession } from "next-auth/react";
import { pluralSuffixer } from "@/lib/str";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import QuizBarChart from "@/components/QuizBarChart/QuizBarChart";
import Chart from "@/components/Chart/Chart";
import Selections from "@/components/Selections/Selections";

type AdminPageProps = {
   usersGraph: {
      name: string;
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
         <div className="text-xxl bold-700 full dfb align-center justify-center gap-7">Admin Dashboard</div>
         <div className="text-xs full text-center pd-1">Welcome to the Admin Page {session?.user?.name}</div>

         <div className="box full pd-2 dfb column gap-10">
            <Card styles={{
               width: "100%", height: "fit-content", padding: "10px",
               display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
               <div className="text-m bold-700 full pd-1 pdx-15">
                  User Chart
               </div>
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
            <Card styles={{ width: "100%", padding: "25px" }}>
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
         
         <div className="box pd-2 full dfb column gap-10">
            <QuizBarChart
               color={"#1121ff"}
               data={[
                  { name: "Google Auth", value: ((filterUsersByOauth("google").length/usersGraph.length)*100)  },
                  { name: "Credentials Auth", value: ((filterUsersByOauth("credentials").length/usersGraph.length)*100)  }
               ]}
               subject={"Oauth Providers"}
               barDataKey="value"
               labelDataKey="name"
            />
         </div>

         <Spacing size={4} />
      </AppWrapper>
   )
}

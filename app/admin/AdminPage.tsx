"use client"
import { useEffect, useState } from "react";
import { chartCurrentMonth, chartGroupByMonth, chartLast7Days, chartTodayHourly, getUniqueYears } from "@/utils/chart";
import { useSession } from "next-auth/react";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { NormalCardStyles, UserCardStyles } from "@/styles-extra/styles";
import { adminUpgradeUserSubscription } from "../actions/user";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/ModalContext";
import { formatMilliseconds, timeAgo } from "@/utils/date";
import { CircleX, Crown, Delete } from "lucide-react";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Spacing from "@/components/Spacing/Spacing";
import Card from "@/components/Card/Card";
import Chart from "@/components/Chart/Chart";
import Selections from "@/components/Selections/Selections";
import ProgressBar from "@/components/Analytics/ProgressBar/ProgressBar";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { referralChannels, studentTypes } from "../sign-in/onboardingUtil";

type AdminPageProps = {
   usersGraph: {
      name: string;
      email: string;
      userid: string;
      oauth_provider: string;
      referralChannel: string;
      studentType: string;
      is_subscribed: boolean;
      createdAt: Date;
   }[]
}

function UserManageCard ({ usersGraph }: { usersGraph: AdminPageProps['usersGraph'] }) {
   const { showModal, close } = useModal();
   const [searchUsers, setSearchUsers] = useState("");
   const [filterRefChannelBy, setFilterRefChannelBy] = useState("all");
   const [filterStudentTypeBy, setFilterStudentTypeBy] = useState("all");

   function applySearchFilters () {
      return usersGraph.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
         .filter(user => (
            user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
            user.email.toLowerCase().includes(searchUsers.toLowerCase())
         ))
         .filter(user => (
            (filterRefChannelBy == "all" ? true : user.referralChannel == filterRefChannelBy)
         ))
         .filter(user => (
            (filterStudentTypeBy == "all" ? true : user.studentType == filterStudentTypeBy)
         ))
   }

   function handleOpenUserDetails (user: AdminPageProps['usersGraph'][0]) {
      async function toggleUserSubscription (callback: Function) {
         const completed = await adminUpgradeUserSubscription(user.userid, user.email, user.name, !user.is_subscribed);
         if (completed) {
            toast.success(
               user.is_subscribed
                  ? `Removed ${user.name} from Grxnd Subscription`
                  : `Subscribed ${user.name} to Grxnd`
            )
            close();
         } else {
            toast.error("Failed to update user subscription");
         }
         callback();
      }

      showModal({
         content: (
            <div className="box full pd-2 pdx-2">
               <div className="text-ml full bold-600 accent-color">{user.name}</div>
               <div className="text-xxs full grey-5 pd-05">{user.email}</div>
               <div className="text-xxs full grey-5">{user.oauth_provider}</div>
               <div className="box full pd-2">
                  <AwaitButton className="xxs pd-12 pdx-2" onClick={toggleUserSubscription}>
                     {(user.is_subscribed) ? (<>
                        <Delete size={17} /> Remove Subscription
                     </>) : (<>
                        <Crown size={17} /> Give Subscription
                     </>)}
                  </AwaitButton>
               </div>
               <Spacing />
               <div className="text-sm full bold-500">Metadata</div>
               <div className="text-xxs full pd-05"><b>Referral Channel:</b> {titleCase(user.referralChannel.replaceAll("-"," "))}</div>
               <div className="text-xxs full"><b>Student Type:</b> {titleCase(user.studentType.replaceAll("-"," "))}</div>
               <Spacing />
               <div className="text-xxs full grey-5">{user.name} joined Grxnd on {formatMilliseconds(new Date(user.createdAt).getTime(), true)}</div>
            </div>
         )
      })
   }

   return (
      <Card styles={{ ...NormalCardStyles, padding: "30px" }}>
         <div className="text-m full bold-600">All Users</div>
         <div className="text-xxs pd-1 full">All the wonderful users of Grxnd</div>
         <div className="box full">
            <input 
               type="text" className="xxs pd-13 pdx-2 full mw-400" placeholder="Search Users"
               value={searchUsers} onChange={e => setSearchUsers(e.target.value)}
            />
         </div>
         <div className="box full pd-1 dfb column gap-5 mt-1">
            <div className="text-sm bold-600 full">Referral Channels</div>
            <Selections 
               selections={[ 'All', ...referralChannels.map(refChannel => titleCase(refChannel.channel)) ]}
               onSelect={(index: number) => setFilterRefChannelBy(index == 0 ? 'all' : referralChannels[index-1].channel)}
            />
         </div>
         <div className="box full pd-1 mb-1 dfb column gap-5">
            <div className="text-sm bold-600 full">Student Type</div>
            <Selections 
               selections={[ 'All', ...studentTypes.map(studentType => titleCase(studentType.studentType)) ]}
               onSelect={(index: number) => setFilterStudentTypeBy(index == 0 ? 'all' : studentTypes[index-1].studentType)}
            />
         </div>
         <div className="box full dfb wrap gap-10 pd-15">
            {applySearchFilters().map(user => (
               <div key={user.userid} style={UserCardStyles} onClick={() => handleOpenUserDetails(user)}>
                  <div className="text-s bold-700 full accent-color-gradient-dark-text">{user.name}</div>
                  <div className="text-xxs full grey-5">{user.email}</div>
                  <div className="text-xxs full grey-5">Joined {timeAgo(new Date(user.createdAt).getTime())}</div>
                  <div className={`text-xxs full bold-600 dfb align-center gap-5 ${user.is_subscribed ? "accent-color" : "error-text"}`}>
                     {user.is_subscribed 
                        ? <>Subscribed <Crown size={17} /></>
                        : <>Not Subscribed <CircleX size={17} /></>
                     }
                  </div>
               </div>
            ))}
         </div>
      </Card>
   )
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

   function filterUsersByRefChannel (referralChannel: ReferralChannel) {
      return usersGraph.filter(user => user.referralChannel == referralChannel);
   }

   function filterUsersByStudentType (studentType: StudentType) {
      return usersGraph.filter(user => user.studentType == studentType);
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
                  <div className="text-m bold-700 full pd-1 pdx-15">Grxnd User Analytics</div>
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
               <div className="text-m full bold-600">Authentication</div>
               <div className="box full dfb column gap-10 pd-1">
                  <ProgressBar percentage={(filterUsersByOauth("google").length/usersGraph.length)*100} label="Google Auth" />
                  <ProgressBar percentage={(filterUsersByOauth("credentials").length/usersGraph.length)*100} label="Credentials Auth" />
               </div>
            </Card>

            <div className="box full pd-2 dfb wrap gap-10" style={{ justifyContent: "space-between" }}>
               <Card styles={{ ...NormalCardStyles, maxWidth: "580px" }}>
                  <div className="text-m full bold-600">User Referral Channels</div>
                  <div className="box full dfb column gap-10 pd-1">
                     {referralChannels.map((refChannel, index) => (
                        <ProgressBar key={index} percentage={(filterUsersByRefChannel(refChannel.channel).length/usersGraph.length)*100} label={refChannel.label} />
                     ))}
                  </div>
               </Card>
               <Card styles={{ ...NormalCardStyles, maxWidth: "580px" }}>
                  <div className="text-m full bold-600">Student Types</div>
                  <div className="box full dfb column gap-10 pd-1">
                     {studentTypes.map((studentType, index) => (
                        <ProgressBar key={index} percentage={(filterUsersByStudentType(studentType.studentType).length/usersGraph.length)*100} label={studentType.label} />
                     ))}
                  </div>
               </Card>
            </div>
            <Spacing />
            
            <UserManageCard usersGraph={usersGraph} />

            <Spacing size={4} />
         </div>
      </AppWrapper>
   )
}

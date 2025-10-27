type ChartMonthlyData = {
   year: number;
   month: string;
   totalUsers: number;
};

export function chartGroupByMonth (data: UserGraphDetails[], targetYear: number): ChartMonthlyData[] {
   // Initialize the months of the year
   const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
   ];

   // Initialize an object to track the amounts for each year and month
   const grouped: { [key: number]: { [key: string]: number } } = {};

   // Get the current date for determining the current month and year
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonthIndex = currentDate.getMonth(); // 0-based (0 = Jan, 11 = Dec)

   // Set initial amount for each month and year as 0
   data.forEach(({ createdAt: date }) => {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = months[dateObj.getMonth()]; // Get the 3-letter month name (Jan, Feb, etc.)

      // Only process data for the target year
      if (year === targetYear) {
         if (!grouped[year]) {
            grouped[year] = {};
            months.forEach(monthName => {
               grouped[year][monthName] = 0; // Initialize each month with 0
            });
         }

         grouped[year][month] += 1; // Add the amount to the corresponding month of the year
      }
   });

   // Return the result for the specified year
   const result: ChartMonthlyData[] = [];

   // If the year exists, format the result for the required months
   if (grouped[targetYear]) {
      const monthsData = grouped[targetYear];

      // If we're in the current year, stop at the current month
      const lastMonthToShow = targetYear === currentYear ? currentMonthIndex : 11;

      months.slice(0, lastMonthToShow + 1).forEach(month => {
         result.push({
            year: targetYear,
            month,
            totalUsers: monthsData[month]
         });
      });
   }

   return result;
}

export function chartLast7Days(data: UserGraphDetails[]): { date: string; totalUsers: number }[] {
   const now = Date.now();
   const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

   // Generate the last 7 days
   const last7Days: string[] = [];
   for (let i = 0; i < 7; i++) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000);
      const shortDate = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(shortDate);
   }

   // Group the data by date
   const groupedByDate: { [key: string]: number } = {};
   data.forEach(({ createdAt: date }) => {
      const dateStr = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if ((new Date(date).getTime()) >= sevenDaysAgo) {
         if (!groupedByDate[dateStr]) {
            groupedByDate[dateStr] = 0;
         }
         groupedByDate[dateStr] += 1;
      }
   });

   // Create the result array
   const result = last7Days.map(date => ({
      date,
      totalUsers: groupedByDate[date] || 0, // If no data for the date, set totalAmount to 0
   }));

   return result.toReversed();
}

export function chartCurrentMonth(data: UserGraphDetails[]): { day: string; totalUsers: number }[] {
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonthIndex = currentDate.getMonth(); // 0-based (0 = Jan, 11 = Dec)
   const currentMonth = currentDate.toLocaleString('default', { month: 'short' }); // Short month name (e.g., "May")

   // Calculate the number of days in the current month
   const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

   // Initialize an array with 0s for each day of the month
   const dailyAmounts = Array.from({ length: daysInMonth }, (_, i) => ({
      day: `${currentMonth} ${i + 1}`, // Format the day as "May 1", "May 2", etc.
      totalUsers: 0
   }));

   // Sum up the amounts for each day
   data.forEach(({ createdAt: date }) => {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const monthIndex = dateObj.getMonth(); // 0-based month index
      const day = dateObj.getDate(); // 1-based day of the month

      // Check if the date is in the current month and year
      if (monthIndex === currentMonthIndex && year === currentYear) {
         dailyAmounts[day - 1].totalUsers += 1; // Add the amount to the corresponding day
      }
   });

   return dailyAmounts;
}

export function chartTodayHourly(data: UserGraphDetails[]): { hour: string; totalUsers: number }[] {
   const now = new Date();
   const currentYear = now.getFullYear();
   const currentMonth = now.getMonth();
   const currentDay = now.getDate();

   // Initialize 24 hours with 0 users
   const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const period = hour >= 12 ? 'pm' : 'am';
      const hour12 = hour % 12 === 0 ? 12 : hour % 12; // Convert to 12-hour format
      return {
         hour: `${hour12}${period}`, // e.g. "1am", "12pm"
         totalUsers: 0,
      };
   });

   // Count users per hour for today
   data.forEach(({ createdAt }) => {
      const dateObj = new Date(createdAt);
      if (
         dateObj.getFullYear() === currentYear &&
         dateObj.getMonth() === currentMonth &&
         dateObj.getDate() === currentDay
      ) {
         const hour = dateObj.getHours();
         hourlyData[hour].totalUsers += 1;
      }
   });

   return hourlyData;
}


export function getUniqueYears(data: UserGraphDetails[]): string[] {
   const years = data.map(item => {
      const date = new Date(item.createdAt);
      return date.getFullYear().toString();
   });

   // Filter out duplicates and return the unique years
   return [...new Set(years)];
}
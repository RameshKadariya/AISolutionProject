// Smart Data Manager - Synchronizes real inquiries with analytics
import { format, subDays, subHours, parseISO, isAfter, isBefore } from 'date-fns';

class SmartDataManager {
  constructor() {
    this.realInquiries = [];
    this.baseMultiplier = 15; // Multiply real data by this factor for demo purposes
    this.historicalGrowthRate = 0.02; // 2% daily growth simulation
  }

  // Set real inquiries from AdminArea
  setRealInquiries(inquiries) {
    this.realInquiries = inquiries || [];
    console.log('📊 Smart Data Manager: Updated with', this.realInquiries.length, 'real inquiries');
  }

  // Get current inquiry count (real + simulated growth)
  getCurrentInquiryCount() {
    const realCount = this.realInquiries.length;
    if (realCount === 0) return 1247; // Fallback for demo
    
    // Use real count as base and simulate growth over time
    const daysInOperation = 180; // Assume 6 months of operation
    const simulatedTotal = Math.floor(realCount * this.baseMultiplier * (1 + (this.historicalGrowthRate * daysInOperation)));
    
    return Math.max(simulatedTotal, realCount);
  }

  // Generate realistic historical data based on real inquiries
  generateHistoricalData(days = 30) {
    const data = [];
    const now = new Date();
    const currentTotal = this.getCurrentInquiryCount();
    const dailyAverage = Math.floor(currentTotal / 180); // Spread over 6 months
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Check if we have real inquiries for this date
      const realInquiriesForDate = this.realInquiries.filter(inquiry => {
        if (!inquiry.date) return false;
        const inquiryDate = format(parseISO(inquiry.date), 'yyyy-MM-dd');
        return inquiryDate === dateStr;
      });

      let dailyCount;
      if (realInquiriesForDate.length > 0) {
        // Use real data as base and multiply for realistic volume
        dailyCount = realInquiriesForDate.length * this.baseMultiplier;
      } else {
        // Generate realistic variation around daily average
        const baseCount = Math.floor(dailyAverage * Math.pow(1 + this.historicalGrowthRate, -i));
        const variation = (Math.random() - 0.5) * 0.3; // ±30% variation
        dailyCount = Math.max(1, Math.floor(baseCount * (1 + variation)));
      }

      data.push({
        date: dateStr,
        inquiries: dailyCount,
        conversions: Math.floor(dailyCount * (0.25 + Math.random() * 0.15)), // 25-40% conversion
        revenue: dailyCount * (15000 + Math.random() * 10000) // $15K-25K average
      });
    }
    
    return data;
  }

  // Generate country distribution based on real inquiries
  generateCountryData() {
    const countries = [
      { name: 'United States', code: 'US', weight: 0.25 },
      { name: 'United Kingdom', code: 'GB', weight: 0.15 },
      { name: 'Germany', code: 'DE', weight: 0.12 },
      { name: 'Canada', code: 'CA', weight: 0.10 },
      { name: 'Australia', code: 'AU', weight: 0.08 },
      { name: 'France', code: 'FR', weight: 0.07 },
      { name: 'Japan', code: 'JP', weight: 0.06 },
      { name: 'Singapore', code: 'SG', weight: 0.05 },
      { name: 'Netherlands', code: 'NL', weight: 0.04 },
      { name: 'Sweden', code: 'SE', weight: 0.03 },
      { name: 'India', code: 'IN', weight: 0.05 }
    ];

    // Analyze real inquiries for country patterns
    const realCountryStats = {};
    this.realInquiries.forEach(inquiry => {
      const country = inquiry.country || 'United States';
      realCountryStats[country] = (realCountryStats[country] || 0) + 1;
    });

    const totalReal = this.getCurrentInquiryCount();

    return countries.map(country => {
      // If we have real data for this country, use it as influence
      const realCount = realCountryStats[country.name] || 0;
      let inquiries;
      
      if (realCount > 0) {
        // Use real data as base and scale up
        inquiries = realCount * this.baseMultiplier;
      } else {
        // Use weighted distribution
        inquiries = Math.floor(totalReal * country.weight * (0.8 + Math.random() * 0.4));
      }

      return {
        ...country,
        inquiries,
        revenue: Math.floor(inquiries * 20000 * (0.8 + Math.random() * 0.4))
      };
    });
  }

  // Generate industry distribution based on real inquiries
  generateIndustryData() {
    const industries = [
      { name: 'Healthcare', weight: 0.28, color: '#ff6b6b' },
      { name: 'Finance', weight: 0.22, color: '#4ecdc4' },
      { name: 'Technology', weight: 0.18, color: '#45b7d1' },
      { name: 'Manufacturing', weight: 0.15, color: '#f9ca24' },
      { name: 'Retail', weight: 0.10, color: '#6c5ce7' },
      { name: 'Education', weight: 0.07, color: '#a0e7e5' }
    ];

    // Analyze real inquiries for industry patterns
    const realIndustryStats = {};
    this.realInquiries.forEach(inquiry => {
      const industry = inquiry.industry || 'Technology';
      realIndustryStats[industry] = (realIndustryStats[industry] || 0) + 1;
    });

    const totalReal = this.getCurrentInquiryCount();

    return industries.map(industry => {
      const realCount = realIndustryStats[industry.name] || 0;
      let inquiries;
      
      if (realCount > 0) {
        inquiries = realCount * this.baseMultiplier;
      } else {
        inquiries = Math.floor(totalReal * industry.weight * (0.8 + Math.random() * 0.4));
      }

      return {
        ...industry,
        inquiries,
        avgValue: Math.floor(15000 + Math.random() * 20000)
      };
    });
  }

  // Generate real-time metrics based on actual data
  generateRealTimeMetrics() {
    const totalInquiries = this.getCurrentInquiryCount();
    const realCount = this.realInquiries.length;
    
    // Calculate real growth if we have enough data
    let monthlyGrowth = 8 + Math.random() * 8; // Default 8-16%
    let weeklyGrowth = 2 + Math.random() * 4; // Default 2-6%
    
    if (realCount > 0) {
      // Analyze real inquiry dates for growth trends
      const now = new Date();
      const lastMonth = subDays(now, 30);
      const lastWeek = subDays(now, 7);
      
      const recentInquiries = this.realInquiries.filter(inquiry => {
        if (!inquiry.date) return false;
        const inquiryDate = parseISO(inquiry.date);
        return isAfter(inquiryDate, lastMonth);
      });
      
      const weeklyInquiries = this.realInquiries.filter(inquiry => {
        if (!inquiry.date) return false;
        const inquiryDate = parseISO(inquiry.date);
        return isAfter(inquiryDate, lastWeek);
      });
      
      if (recentInquiries.length > 0) {
        monthlyGrowth = Math.max(0, (recentInquiries.length / realCount) * 100);
      }
      
      if (weeklyInquiries.length > 0) {
        weeklyGrowth = Math.max(0, (weeklyInquiries.length / realCount) * 100);
      }
    }

    // Calculate average response time based on real inquiry statuses
    let avgResponseTime = 1.5 + Math.random() * 2; // Default 1.5-3.5 hours
    const respondedInquiries = this.realInquiries.filter(i => i.status !== 'New');
    if (respondedInquiries.length > 0) {
      // Simulate realistic response times based on status distribution
      const responseRatio = respondedInquiries.length / realCount;
      avgResponseTime = responseRatio > 0.8 ? 1.2 + Math.random() * 1 : 2 + Math.random() * 2;
    }

    // Calculate conversion rate based on real inquiry statuses
    let conversionRate = 25 + Math.random() * 15; // Default 25-40%
    const closedInquiries = this.realInquiries.filter(i => i.status === 'Closed');
    if (realCount > 0) {
      const realConversionRate = (closedInquiries.length / realCount) * 100;
      conversionRate = Math.max(realConversionRate, 20); // Minimum 20% for demo
    }
    
    return {
      totalInquiries,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeCountries: this.getUniqueCountries().length,
      topIndustry: this.getTopIndustry(),
      peakHours: this.calculatePeakHours(),
      lastUpdated: new Date(),
      realInquiriesCount: realCount,
      simulationMultiplier: this.baseMultiplier
    };
  }

  // Get unique countries from real inquiries
  getUniqueCountries() {
    const countries = new Set();
    this.realInquiries.forEach(inquiry => {
      countries.add(inquiry.country || 'United States');
    });
    return Array.from(countries);
  }

  // Get top industry from real inquiries
  getTopIndustry() {
    const industryCount = {};
    this.realInquiries.forEach(inquiry => {
      const industry = inquiry.industry || 'Technology';
      industryCount[industry] = (industryCount[industry] || 0) + 1;
    });
    
    const topIndustry = Object.keys(industryCount).reduce((a, b) => 
      industryCount[a] > industryCount[b] ? a : b, 'Healthcare'
    );
    
    return topIndustry;
  }

  // Calculate peak hours based on real inquiry timestamps
  calculatePeakHours() {
    if (this.realInquiries.length === 0) return '2-4 PM GMT';
    
    const hourCounts = {};
    this.realInquiries.forEach(inquiry => {
      if (inquiry.date) {
        const hour = parseISO(inquiry.date).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    const peakHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b, '14'
    );
    
    const peakHourInt = parseInt(peakHour);
    const endHour = peakHourInt + 2;
    
    return `${peakHourInt}-${endHour} ${peakHourInt >= 12 ? 'PM' : 'AM'} GMT`;
  }

  // Generate live activity based on real inquiry patterns
  generateLiveActivity(count = 10) {
    const activities = [];
    const now = new Date();
    
    // Use real inquiries as templates for realistic activity
    const templates = this.realInquiries.length > 0 ? this.realInquiries : [
      { country: 'United States', industry: 'Technology', status: 'New' }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const timestamp = subHours(now, Math.random() * 2); // Last 2 hours
      
      activities.push({
        id: Math.random().toString(36).substring(2, 11),
        type: 'inquiry',
        message: `New inquiry from ${template.country || 'United States'} in ${template.industry || 'Technology'}`,
        timestamp,
        country: template.country || 'United States',
        industry: template.industry || 'Technology',
        priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        value: Math.random() * 50000 + 5000
      });
    }
    
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Generate hourly data with realistic patterns
  generateHourlyData() {
    const data = [];
    const now = new Date();
    const dailyTotal = Math.floor(this.getCurrentInquiryCount() / 180); // Daily average
    
    for (let i = 23; i >= 0; i--) {
      const hour = subHours(now, i);
      const hourOfDay = hour.getHours();
      
      // Analyze real inquiries for this hour pattern
      const realHourlyCount = this.realInquiries.filter(inquiry => {
        if (!inquiry.date) return false;
        return parseISO(inquiry.date).getHours() === hourOfDay;
      }).length;
      
      let hourlyCount;
      if (realHourlyCount > 0) {
        // Use real pattern and scale up
        hourlyCount = realHourlyCount * Math.floor(this.baseMultiplier / 24);
      } else {
        // Use business hours logic
        const baseCount = Math.floor(dailyTotal / 24);
        let multiplier = 1;
        
        if ((hourOfDay >= 9 && hourOfDay <= 11) || (hourOfDay >= 14 && hourOfDay <= 16)) {
          multiplier = 1.5; // Peak hours
        } else if (hourOfDay >= 22 || hourOfDay <= 6) {
          multiplier = 0.3; // Off hours
        }
        
        hourlyCount = Math.floor(baseCount * multiplier * (0.8 + Math.random() * 0.4));
      }
      
      data.push({
        hour: format(hour, 'HH:mm'),
        inquiries: Math.max(0, hourlyCount),
        timestamp: hour
      });
    }
    
    return data;
  }

  // Get summary for admin dashboard
  getDataSummary() {
    return {
      realInquiries: this.realInquiries.length,
      simulatedTotal: this.getCurrentInquiryCount(),
      multiplier: this.baseMultiplier,
      lastSync: new Date(),
      dataQuality: this.realInquiries.length > 0 ? 'High' : 'Demo Mode'
    };
  }
}

export default new SmartDataManager();
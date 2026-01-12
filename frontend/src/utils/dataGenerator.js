// Real-time Data Generator for Analytics Dashboard
import { format, subDays, subHours, subMinutes } from 'date-fns';

class RealTimeDataGenerator {
  constructor() {
    this.countries = [
      { name: 'United States', code: 'US', lat: 39.8283, lng: -98.5795, weight: 0.25 },
      { name: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360, weight: 0.15 },
      { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, weight: 0.12 },
      { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468, weight: 0.10 },
      { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, weight: 0.08 },
      { name: 'France', code: 'FR', lat: 46.2276, lng: 2.2137, weight: 0.07 },
      { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, weight: 0.06 },
      { name: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198, weight: 0.05 },
      { name: 'Netherlands', code: 'NL', lat: 52.1326, lng: 5.2913, weight: 0.04 },
      { name: 'Sweden', code: 'SE', lat: 60.1282, lng: 18.6435, weight: 0.03 },
      { name: 'India', code: 'IN', lat: 20.5937, lng: 78.9629, weight: 0.05 }
    ];

    this.industries = [
      { name: 'Healthcare', weight: 0.28, color: '#ff6b6b' },
      { name: 'Finance', weight: 0.22, color: '#4ecdc4' },
      { name: 'Technology', weight: 0.18, color: '#45b7d1' },
      { name: 'Manufacturing', weight: 0.15, color: '#f9ca24' },
      { name: 'Retail', weight: 0.10, color: '#6c5ce7' },
      { name: 'Education', weight: 0.07, color: '#a0e7e5' }
    ];

    this.services = [
      { name: 'AI Analytics', weight: 0.35, color: '#ff9900' },
      { name: 'Automation', weight: 0.25, color: '#ffb84d' },
      { name: 'Computer Vision', weight: 0.20, color: '#ffd93d' },
      { name: 'NLP Solutions', weight: 0.15, color: '#6bcf7f' },
      { name: 'Custom AI', weight: 0.05, color: '#4d79ff' }
    ];

    this.deviceTypes = [
      { name: 'Desktop', weight: 0.45, color: '#ff9900' },
      { name: 'Mobile', weight: 0.35, color: '#ffb84d' },
      { name: 'Tablet', weight: 0.20, color: '#ffd93d' }
    ];

    this.statusTypes = [
      { name: 'New', weight: 0.40, color: '#ff9900' },
      { name: 'In Progress', weight: 0.30, color: '#ffc107' },
      { name: 'Contacted', weight: 0.20, color: '#28a745' },
      { name: 'Closed', weight: 0.10, color: '#6c757d' }
    ];

    this.baseInquiryCount = 1247;
    this.dailyGrowthRate = 0.02; // 2% daily growth
    this.hourlyVariation = 0.15; // 15% hourly variation
  }

  // Generate weighted random selection
  getWeightedRandom(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return items[0];
  }

  // Generate realistic inquiry data
  generateInquiry(timestamp = new Date()) {
    const country = this.getWeightedRandom(this.countries);
    const industry = this.getWeightedRandom(this.industries);
    const service = this.getWeightedRandom(this.services);
    const device = this.getWeightedRandom(this.deviceTypes);
    const status = this.getWeightedRandom(this.statusTypes);

    return {
      id: Math.random().toString(36).substring(2, 11),
      timestamp,
      country: country.name,
      countryCode: country.code,
      lat: country.lat + (Math.random() - 0.5) * 10, // Add some variation
      lng: country.lng + (Math.random() - 0.5) * 10,
      industry: industry.name,
      service: service.name,
      device: device.name,
      status: status.name,
      responseTime: Math.random() * 8 + 0.5, // 0.5 to 8.5 hours
      value: Math.random() * 50000 + 5000, // $5K to $55K potential value
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
    };
  }

  // Generate historical data for charts
  generateHistoricalData(days = 30) {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i);
      const baseCount = Math.floor(this.baseInquiryCount * Math.pow(1 + this.dailyGrowthRate, -i));
      
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * this.hourlyVariation;
      const dailyCount = Math.max(1, Math.floor(baseCount * (1 + variation)));
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        inquiries: dailyCount,
        conversions: Math.floor(dailyCount * (0.25 + Math.random() * 0.15)), // 25-40% conversion
        revenue: dailyCount * (15000 + Math.random() * 10000) // $15K-25K average
      });
    }
    
    return data;
  }

  // Generate hourly data for today
  generateHourlyData() {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = subHours(now, i);
      const baseCount = Math.floor(this.baseInquiryCount / 24);
      
      // Peak hours: 9-11 AM and 2-4 PM
      const hourOfDay = hour.getHours();
      let multiplier = 1;
      if ((hourOfDay >= 9 && hourOfDay <= 11) || (hourOfDay >= 14 && hourOfDay <= 16)) {
        multiplier = 1.5;
      } else if (hourOfDay >= 22 || hourOfDay <= 6) {
        multiplier = 0.3;
      }
      
      const hourlyCount = Math.floor(baseCount * multiplier * (0.8 + Math.random() * 0.4));
      
      data.push({
        hour: format(hour, 'HH:mm'),
        inquiries: hourlyCount,
        timestamp: hour
      });
    }
    
    return data;
  }

  // Generate real-time metrics
  generateRealTimeMetrics() {
    const totalInquiries = this.baseInquiryCount + Math.floor(Math.random() * 50);
    const monthlyGrowth = 8 + Math.random() * 8; // 8-16%
    const weeklyGrowth = 2 + Math.random() * 4; // 2-6%
    const avgResponseTime = 1.5 + Math.random() * 2; // 1.5-3.5 hours
    const conversionRate = 25 + Math.random() * 15; // 25-40%
    
    return {
      totalInquiries,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeCountries: this.countries.length,
      topIndustry: this.industries[0].name,
      peakHours: '2-4 PM GMT',
      lastUpdated: new Date()
    };
  }

  // Generate country distribution data
  generateCountryData() {
    return this.countries.map(country => ({
      ...country,
      inquiries: Math.floor(this.baseInquiryCount * country.weight * (0.8 + Math.random() * 0.4)),
      revenue: Math.floor(this.baseInquiryCount * country.weight * 20000 * (0.8 + Math.random() * 0.4))
    }));
  }

  // Generate industry distribution data
  generateIndustryData() {
    return this.industries.map(industry => ({
      ...industry,
      inquiries: Math.floor(this.baseInquiryCount * industry.weight * (0.8 + Math.random() * 0.4)),
      avgValue: Math.floor(15000 + Math.random() * 20000)
    }));
  }

  // Generate service popularity data
  generateServiceData() {
    return this.services.map(service => ({
      ...service,
      inquiries: Math.floor(this.baseInquiryCount * service.weight * (0.8 + Math.random() * 0.4)),
      satisfaction: Math.round((85 + Math.random() * 10) * 10) / 10 // 85-95%
    }));
  }

  // Generate device analytics
  generateDeviceData() {
    return this.deviceTypes.map(device => ({
      ...device,
      users: Math.floor(this.baseInquiryCount * device.weight * (0.8 + Math.random() * 0.4)),
      conversionRate: Math.round((20 + Math.random() * 20) * 10) / 10 // 20-40%
    }));
  }

  // Generate live activity feed
  generateLiveActivity(count = 10) {
    const activities = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const timestamp = subMinutes(now, Math.random() * 60); // Last hour
      const inquiry = this.generateInquiry(timestamp);
      
      activities.push({
        id: inquiry.id,
        type: 'inquiry',
        message: `New inquiry from ${inquiry.country} in ${inquiry.industry}`,
        timestamp,
        country: inquiry.country,
        industry: inquiry.industry,
        priority: inquiry.priority,
        value: inquiry.value
      });
    }
    
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Simulate real-time updates
  simulateRealTimeUpdate() {
    // Randomly generate new inquiries
    if (Math.random() < 0.3) { // 30% chance every update
      return this.generateInquiry();
    }
    return null;
  }
}

export default new RealTimeDataGenerator();
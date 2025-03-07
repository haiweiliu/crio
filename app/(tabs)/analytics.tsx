import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView, Pressable, Dimensions, Alert, Animated, Modal } from 'react-native';
import { TrendingUp, Calendar, Users, DollarSign, BarChart, PieChart, Activity, Crown, Lock, Thermometer } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEventStore } from '@/store/eventStore';
import { useUserStore } from '@/store/userStore';
import { categories } from '@/mocks/categories';
import { EventCategory } from '@/types/event';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PieChart as PieChartKit, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const { events } = useEventStore();
  const { profile } = useUserStore();
  const isVip = profile.isVip;
  
  const [activeTab, setActiveTab] = useState<'trends' | 'categories' | 'socials' | 'takeaways'>('trends');
  const [categoryData, setCategoryData] = useState<{category: EventCategory, count: number, percentage: number}[]>([]);
  const [trendingEvents, setTrendingEvents] = useState(events.slice(0, 5));
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [monthlyTrend, setMonthlyTrend] = useState<{month: string, count: number}[]>([]);
  const [priceRanges, setPriceRanges] = useState<{range: string, count: number}[]>([]);
  const [timeSlots, setTimeSlots] = useState<{slot: string, count: number}[]>([]);
  const [categoryGrowth, setCategoryGrowth] = useState<{category: string, growth: number}[]>([]);
  const [attendanceRate, setAttendanceRate] = useState<{month: string, rate: number}[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksAnim = useRef(new Array(5).fill(0).map(() => ({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    position: new Animated.ValueXY({ x: 0, y: 0 })
  }))).current;
  const [selectedInsight, setSelectedInsight] = useState<{
    title: string;
    category: string;
    description: string;
    color: string;
    bullets: string[];
    tldr: string;
    emoji: string;
    timestamp: string;
  } | null>(null);
  const [upgradeButtonScale] = useState(new Animated.Value(1));
  const [upgradeButtonColor, setUpgradeButtonColor] = useState('#22c55e');
  
  useEffect(() => {
    // Calculate category distribution
    const categoryCounts: Record<string, number> = {};
    events.forEach(event => {
      event.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    const totalCategories = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    
    const categoryStats = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category: category as EventCategory,
        count,
        percentage: (count / totalCategories) * 100
      }))
      .sort((a, b) => b.count - a.count);
    
    setCategoryData(categoryStats);
    
    // Calculate upcoming events
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.startDate) > now);
    setUpcomingCount(upcoming.length);
    
    // Calculate average price
    const paidEvents = events.filter(event => event.price && event.price.amount > 0);
    const totalPrice = paidEvents.reduce((sum, event) => sum + (event.price?.amount || 0), 0);
    setAveragePrice(paidEvents.length > 0 ? totalPrice / paidEvents.length : 0);
    
    // Calculate total attendees
    const attendees = events.reduce((sum, event) => sum + event.attendees, 0);
    setTotalAttendees(attendees);
    
    // Calculate monthly trend
    const months: Record<string, number> = {};
    events.forEach(event => {
      const date = new Date(event.startDate);
      date.setFullYear(2024);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      months[monthYear] = (months[monthYear] || 0) + 1;
    });
    
    const sortedMonths = Object.entries(months)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
      });
    
    setMonthlyTrend(sortedMonths);
    
    // Set trending events based on attendees
    const trending = [...events].sort((a, b) => b.attendees - a.attendees).slice(0, 5);
    setTrendingEvents(trending);

    // Calculate price range distribution
    const ranges = [
      { min: 0, max: 0, label: 'Free' },
      { min: 1, max: 50, label: '$1-50' },
      { min: 51, max: 100, label: '$51-100' },
      { min: 101, max: 200, label: '$101-200' },
      { min: 201, max: Infinity, label: '$200+' }
    ];

    const priceDistribution = ranges.map(range => ({
      range: range.label,
      count: events.filter(event => {
        const price = event.price?.amount || 0;
        return price >= range.min && price <= range.max;
      }).length
    }));
    setPriceRanges(priceDistribution);

    // Calculate popular time slots
    const slots = events.reduce((acc, event) => {
      const hour = new Date(event.startDate).getHours();
      let timeSlot = '';
      if (hour < 12) timeSlot = 'Morning (6AM-12PM)';
      else if (hour < 17) timeSlot = 'Afternoon (12PM-5PM)';
      else if (hour < 21) timeSlot = 'Evening (5PM-9PM)';
      else timeSlot = 'Night (9PM-12AM)';
      
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setTimeSlots(Object.entries(slots).map(([slot, count]) => ({ slot, count })));

    // Calculate category growth with more realistic variations
    const growth = [
      { category: 'DeFi', growth: 45.2 },
      { category: 'RWA', growth: -12.8 },
      { category: 'DePIN', growth: 78.5 },
      { category: 'AI', growth: 156.3 },
      { category: 'Gaming', growth: -8.4 },
      { category: 'Social', growth: 23.7 },
      { category: 'Developer', growth: -5.2 },
      { category: 'Other', growth: 12.9 }
    ].sort((a, b) => b.growth - a.growth);

    setCategoryGrowth(growth);

    // Calculate monthly attendance rate
    const monthlyAttendance = monthlyTrend.map(month => {
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return `${eventDate.toLocaleString('default', { month: 'short' })} ${eventDate.getFullYear()}` === month.month;
      });
      
      const totalAttendees = monthEvents.reduce((sum, event) => sum + event.attendees, 0);
      const averageAttendance = monthEvents.length > 0 ? (totalAttendees / monthEvents.length) : 0;
      
      return {
        month: month.month,
        rate: averageAttendance
      };
    });

    setAttendanceRate(monthlyAttendance);
  }, [events]);
  
  const renderTrendsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Calendar size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming Events</Text>
        </View>
        
        <View style={styles.statCard}>
          <DollarSign size={24} color={colors.secondary} />
          <Text style={styles.statNumber}>${averagePrice.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Avg. Price</Text>
        </View>
        
        <View style={styles.statCard}>
          <Users size={24} color={colors.accent} />
          <Text style={styles.statNumber}>{totalAttendees}</Text>
          <Text style={styles.statLabel}>Total Attendees</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Web3 Event Sentiment</Text>
        <View style={styles.sentimentContainer}>
          <View style={styles.meterContainer}>
            <Text style={styles.meterTitle}>Fear & Greed Index</Text>
            <View style={styles.gaugeContainer}>
              <View style={styles.gauge}>
                <LinearGradient
                  colors={['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gaugeBackground}
                />
                <View 
                  style={[
                    styles.gaugeNeedle,
                    { transform: [{ rotate: '45deg' }] } // Adjust based on value (0-100)
                  ]}
                >
                  <View style={styles.needleCircle}>
                    <View style={styles.needleLine} />
                  </View>
                </View>
              </View>
              <View style={styles.gaugeValue}>
                <Text style={styles.gaugeNumber}>34</Text>
                <Text style={styles.gaugeMood}>Fear</Text>
              </View>
              <View style={styles.gaugeLabels}>
                <Text style={styles.gaugeLabel}>Extreme{'\n'}Fear</Text>
                <Text style={styles.gaugeLabel}>Fear</Text>
                <Text style={styles.gaugeLabel}>Neutral</Text>
                <Text style={styles.gaugeLabel}>Greed</Text>
                <Text style={styles.gaugeLabel}>Extreme{'\n'}Greed</Text>
              </View>
            </View>
            <Text style={styles.gaugeSubtitle}>Multifactorial Web3 Event Market Sentiment</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Event Hotspots</Text>
        <View style={styles.bubbleMapContainer}>
          <View style={styles.bubbleMap}>
            {[
              { city: 'London', events: 45, x: 0.30, y: 0.25, size: 60 },
              { city: 'New York', events: 38, x: 0.20, y: 0.35, size: 55 },
              { city: 'Singapore', events: 32, x: 0.75, y: 0.45, size: 50 },
              { city: 'Dubai', events: 28, x: 0.60, y: 0.40, size: 45 },
              { city: 'Paris', events: 25, x: 0.45, y: 0.30, size: 42 },
            ].map((location, index) => (
              <View
                key={index}
                style={[
                  styles.bubbleLocation,
                  {
                    left: width * location.x,
                    top: 200 * location.y, // 200 is the height of bubbleMap
                    width: location.size,
                    height: location.size,
                  }
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.bubbleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.bubbleCity}>{location.city}</Text>
                <Text style={styles.bubbleEvents}>{location.events}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.bubbleMapLegend}>Size indicates number of events</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Monthly Active Events</Text>
        <LineChart
          data={{
            labels: monthlyTrend.map(item => item.month),
            datasets: [{
              data: monthlyTrend.map(item => item.count)
            }]
          }}
          width={Dimensions.get('window').width - 64}
          height={220}
          chartConfig={{
            backgroundColor: colors.dark.card,
            backgroundGradientFrom: colors.dark.card,
            backgroundGradientTo: colors.dark.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(${parseInt(colors.primary.slice(1,3), 16)}, ${parseInt(colors.primary.slice(3,5), 16)}, ${parseInt(colors.primary.slice(5,7), 16)}, ${opacity})`,
            labelColor: () => colors.dark.textSecondary,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.primary
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Price Distribution</Text>
        <View style={styles.priceRanges}>
          {priceRanges.map((range, index) => (
            <View key={index} style={styles.priceRange}>
              <View style={styles.priceRangeHeader}>
                <Text style={styles.priceRangeLabel}>{range.range}</Text>
                <Text style={styles.priceRangeCount}>{range.count}</Text>
              </View>
              <View style={styles.priceRangeBar}>
                <View 
                  style={[
                    styles.priceRangeFill,
                    { 
                      width: `${(range.count / Math.max(...priceRanges.map(r => r.count))) * 100}%`,
                      backgroundColor: colors.secondary
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Time Slots</Text>
        <View style={styles.timeSlots}>
          {timeSlots.map((slot, index) => (
            <View key={index} style={styles.timeSlot}>
              <View style={styles.timeSlotContent}>
                <Text style={styles.timeSlotLabel}>{slot.slot}</Text>
                <Text style={styles.timeSlotCount}>{slot.count} events</Text>
              </View>
              <View style={styles.timeSlotBar}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={[
                    styles.timeSlotFill,
                    { 
                      width: `${(slot.count / Math.max(...timeSlots.map(t => t.count))) * 100}%`,
                    }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Category Growth (Last 3 Months)</Text>
        <View style={styles.categoryGrowth}>
          {categoryGrowth.map((category, index) => (
            <View key={index} style={styles.growthItem}>
              <Text style={styles.growthCategory}>{category.category}</Text>
              <View style={styles.growthData}>
                <Text 
                  style={[
                    styles.growthRate,
                    { color: category.growth >= 0 ? colors.success : colors.error }
                  ]}
                >
                  {category.growth >= 0 ? '+' : ''}{category.growth.toFixed(1)}%
                </Text>
                <View 
                  style={[
                    styles.growthIndicator,
                    { backgroundColor: category.growth >= 0 ? colors.success : colors.error }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending Events</Text>
        {trendingEvents.map((event, index) => (
          <View key={event.id} style={styles.trendingItem}>
            <Text style={styles.trendingRank}>{index + 1}</Text>
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>{event.title}</Text>
              <View style={styles.trendingMeta}>
                <Text style={styles.trendingAttendees}>{event.attendees} attendees</Text>
                <View style={styles.trendingCategories}>
                  {event.categories.slice(0, 2).map(category => {
                    const categoryInfo = categories.find(c => c.id === category);
                    return (
                      <View 
                        key={category} 
                        style={[
                          styles.trendingCategory,
                          { backgroundColor: categoryInfo?.color || colors.dark.border }
                        ]}
                      >
                        <Text style={styles.trendingCategoryText}>{categoryInfo?.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
  
  const renderCategoriesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Category Distribution</Text>
      <View style={styles.pieChartContainer}>
        <PieChartKit
          data={categoryData.map(item => {
            const categoryInfo = categories.find(c => c.id === item.category);
            return {
              name: categoryInfo?.name || item.category,
              population: item.count,
              color: categoryInfo?.color || colors.dark.border,
              legendFontColor: colors.dark.text,
              legendFontSize: 12,
            };
          })}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: colors.dark.background,
            backgroundGradientFrom: colors.dark.background,
            backgroundGradientTo: colors.dark.background,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor={colors.dark.background}
          paddingLeft="0"
          absolute
        />
      </View>
      
      <View style={styles.categoryLegend}>
        {categoryData.map(item => {
          const categoryInfo = categories.find(c => c.id === item.category);
          return (
            <View key={item.category} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: categoryInfo?.color || colors.dark.border }
                ]} 
              />
              <Text style={styles.legendCategory}>{categoryInfo?.name}</Text>
              <Text style={styles.legendPercentage}>{item.percentage.toFixed(1)}%</Text>
              <Text style={styles.legendCount}>({item.count})</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
  
  const renderSocialsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Social Engagement Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.primary} />
            <Text style={styles.statNumber}>124.5K</Text>
            <Text style={styles.statLabel}>Total Mentions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Activity size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>87%</Text>
            <Text style={styles.statLabel}>Positive Sentiment</Text>
          </View>
          
          <View style={styles.statCard}>
            <Users size={24} color={colors.accent} />
            <Text style={styles.statNumber}>45.2K</Text>
            <Text style={styles.statLabel}>Engagements</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending Keywords</Text>
        <View style={styles.topicsList}>
          {[
            { keyword: "zkSync Era", mentions: 3420, growth: "+156%", sentiment: "positive" },
            { keyword: "Account Abstraction", mentions: 2890, growth: "+89%", sentiment: "positive" },
            { keyword: "Modular Blockchains", mentions: 2456, growth: "+67%", sentiment: "positive" },
            { keyword: "Real World Assets", mentions: 2100, growth: "+45%", sentiment: "neutral" },
            { keyword: "L2 Rollups", mentions: 1890, growth: "+34%", sentiment: "positive" }
          ].map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>{topic.keyword}</Text>
                <Text style={styles.topicMentions}>{topic.mentions.toLocaleString()} mentions</Text>
              </View>
              <Text style={[styles.topicGrowth, { color: topic.sentiment === 'positive' ? colors.success : colors.warning }]}>
                {topic.growth}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Most Discussed Projects</Text>
        <View style={styles.projectsList}>
          {[
            {
              name: "Starknet",
              description: "ZK rollup platform gaining massive traction with new integrations",
              stats: { mentions: "15.2K", sentiment: "92%", growth: "+78%" },
              tags: ["L2", "ZK"],
              color: "#8b5cf6"
            },
            {
              name: "Base",
              description: "Coinbase's L2 solution seeing increased developer adoption",
              stats: { mentions: "12.8K", sentiment: "88%", growth: "+65%" },
              tags: ["L2", "Exchange"],
              color: "#3b82f6"
            },
            {
              name: "Celestia",
              description: "Modular blockchain platform with growing ecosystem",
              stats: { mentions: "10.5K", sentiment: "90%", growth: "+123%" },
              tags: ["Modular", "Data"],
              color: "#ec4899"
            }
          ].map((project, index) => (
            <Pressable key={index} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={styles.projectTags}>
                  {project.tags.map((tag, tagIndex) => (
                    <View 
                      key={tagIndex} 
                      style={[styles.projectTag, { backgroundColor: project.color }]}
                    >
                      <Text style={styles.projectTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.projectDescription}>{project.description}</Text>
              <View style={styles.projectStats}>
                {Object.entries(project.stats).map(([key, value], statIndex) => (
                  <View key={statIndex} style={styles.projectStat}>
                    <Text style={styles.projectStatValue}>{value}</Text>
                    <Text style={styles.projectStatLabel}>{key}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Community Sentiment</Text>
        <View style={styles.sentimentChart}>
          {[
            { platform: "Twitter", positive: 75, neutral: 15, negative: 10 },
            { platform: "Discord", positive: 82, neutral: 12, negative: 6 },
            { platform: "Telegram", positive: 68, neutral: 22, negative: 10 },
            { platform: "Reddit", positive: 71, neutral: 19, negative: 10 }
          ].map((platform, index) => (
            <View key={index} style={styles.sentimentItem}>
              <View style={styles.sentimentHeader}>
                <Text style={styles.sentimentPlatform}>{platform.platform}</Text>
              </View>
              <View style={styles.sentimentBar}>
                <View style={[styles.sentimentSegment, { backgroundColor: colors.success, flex: platform.positive }]} />
                <View style={[styles.sentimentSegment, { backgroundColor: colors.warning, flex: platform.neutral }]} />
                <View style={[styles.sentimentSegment, { backgroundColor: colors.error, flex: platform.negative }]} />
              </View>
              <View style={styles.sentimentLabels}>
                <Text style={styles.sentimentLabel}>{platform.positive}% Positive</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
  
  const renderInsightModal = () => (
    <Modal
      visible={!!selectedInsight}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedInsight(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={[styles.insightCategory, { backgroundColor: selectedInsight?.color }]}>
              <Text style={styles.insightCategoryText}>{selectedInsight?.category}</Text>
            </View>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setSelectedInsight(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalEmoji}>{selectedInsight?.emoji}</Text>
            <Text style={styles.modalTitle}>{selectedInsight?.title}</Text>
            <Text style={styles.insightTimestamp}>{selectedInsight?.timestamp}</Text>
            <View style={styles.tldrContainer}>
              <Text style={styles.tldrLabel}>TL;DR</Text>
              <Text style={styles.tldrText}>{selectedInsight?.tldr}</Text>
            </View>
            <Text style={styles.modalDescription}>{selectedInsight?.description}</Text>
            
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletTitle}>Key Takeaways:</Text>
              {selectedInsight?.bullets.map((bullet, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletEmoji}>💫</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTakeawaysTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insightsScroll}>
          {[
            {
              title: "ETH Denver 2024",
              description: "The largest ETH event showcased major breakthroughs in scaling solutions and institutional DeFi adoption, setting the tone for blockchain innovation in 2024.",
              category: "Conference",
              color: "#6366f1",
              emoji: "🏔️",
              tldr: "ETH Denver reveals the future of scaling and institutional DeFi",
              timestamp: "2 days ago",
              bullets: [
                "Account abstraction becoming mainstream with major wallet implementations",
                "Institutional DeFi platforms launching on L2s with regulatory compliance",
                "New scaling solutions combining ZK proofs with optimistic rollups",
                "Cross-chain infrastructure standardization efforts gaining traction",
                "DeFi real-world asset tokenization platforms going live"
              ]
            },
            {
              title: "Consensys HK Summit",
              description: "Asia's premier Web3 event highlighted the convergence of AI and blockchain, with groundbreaking projects from the APAC region.",
              category: "Summit",
              color: "#ec4899",
              emoji: "🌆",
              tldr: "APAC leads AI-blockchain integration and institutional adoption",
              timestamp: "1 week ago",
              bullets: [
                "Major Asian banks launching blockchain-based trade finance platforms",
                "AI-powered DeFi risk management systems unveiled",
                "Hong Kong's virtual asset regulations attracting institutions",
                "New blockchain-AI hybrid infrastructure projects announced",
                "Cross-border payment solutions using smart contracts and AI"
              ]
            },
            {
              title: "Gaming Revolution",
              description: "Web3 gaming is shifting from play-to-earn to play-and-own, with improved gameplay and user experience.",
              category: "Gaming",
              color: "#22c55e",
              emoji: "🎮",
              tldr: "Games are becoming fun first, crypto second",
              timestamp: "3 days ago",
              bullets: [
                "Focus on gameplay over tokenomics",
                "AAA studios entering Web3",
                "NFTs as subtle gaming enhancements",
                "Cross-game asset compatibility",
                "Mobile-first development approach"
              ]
            },
            {
              title: "Infrastructure Evolution",
              description: "Layer 2s and modular blockchains are reshaping the scalability landscape with innovative approaches to throughput and security.",
              category: "Infrastructure",
              color: "#8b5cf6",
              emoji: "🏗️",
              tldr: "Blockchain architecture is becoming more modular and efficient",
              timestamp: "5 days ago",
              bullets: [
                "Modular chains gaining traction",
                "ZK technology advancing rapidly",
                "Cross-chain communication improving",
                "New consensus mechanisms emerging",
                "Focus on developer experience"
              ]
            },
            {
              title: "Social Renaissance",
              description: "Decentralized social platforms are reimagining online interactions with portable identities and user-owned data.",
              category: "Social",
              color: "#f43f5e",
              emoji: "🤝",
              tldr: "Social networks are being rebuilt with user ownership",
              timestamp: "1 day ago",
              bullets: [
                "Portable social graphs",
                "Monetization for creators",
                "Privacy-first communication",
                "Decentralized reputation systems",
                "Community-owned platforms"
              ]
            },
            {
              title: "Sustainability Focus",
              description: "Web3 projects are increasingly prioritizing environmental impact and sustainable practices.",
              category: "Impact",
              color: "#059669",
              emoji: "🌱",
              tldr: "Crypto is going green and impactful",
              timestamp: "4 days ago",
              bullets: [
                "Energy-efficient consensus mechanisms",
                "Carbon credit tokenization",
                "Regenerative finance projects",
                "Sustainable mining initiatives",
                "Environmental impact tracking"
              ]
            },
            {
              title: "Privacy Revolution",
              description: "Zero-knowledge proofs and privacy-preserving technologies are becoming mainstream in Web3 applications.",
              category: "Privacy",
              color: "#0891b2",
              emoji: "🔐",
              tldr: "Privacy tech is going mainstream in Web3",
              timestamp: "6 days ago",
              bullets: [
                "ZK-proof adoption accelerating",
                "Private DeFi transactions",
                "Identity solutions with privacy",
                "Compliance with privacy",
                "Multi-party computation advances"
              ]
            },
            {
              title: "DAO Evolution",
              description: "DAOs are maturing with better governance models and real-world integration strategies.",
              category: "Governance",
              color: "#c026d3",
              emoji: "⚡",
              tldr: "DAOs are growing up and getting practical",
              timestamp: "2 weeks ago",
              bullets: [
                "Hybrid governance models",
                "Real-world legal integration",
                "Professional DAO management",
                "Cross-DAO collaboration",
                "Token-weighted voting alternatives"
              ]
            },
            {
              title: "DePIN Emergence",
              description: "Decentralized Physical Infrastructure Networks are connecting blockchain to the real world.",
              category: "Infrastructure",
              color: "#ea580c",
              emoji: "📡",
              tldr: "Web3 is bridging to physical infrastructure",
              timestamp: "1 week ago",
              bullets: [
                "Decentralized wireless networks",
                "IoT device networks",
                "Physical asset tokenization",
                "Infrastructure DAOs",
                "Real-world data oracles"
              ]
            },
            {
              title: "Security Innovation",
              description: "New security paradigms and tools are emerging to protect Web3 assets and users.",
              category: "Security",
              color: "#dc2626",
              emoji: "🛡️",
              tldr: "Security is evolving beyond smart contract audits",
              timestamp: "3 days ago",
              bullets: [
                "AI-powered threat detection",
                "Real-time monitoring tools",
                "Multi-sig evolution",
                "Insurance protocols",
                "Automated security testing"
              ]
            },
            {
              title: "NFT Utility",
              description: "NFTs are finding practical applications beyond digital art in various industries.",
              category: "NFTs",
              color: "#7c3aed",
              emoji: "🎨",
              tldr: "NFTs are becoming useful tools beyond art",
              timestamp: "5 days ago",
              bullets: [
                "Identity and access management",
                "Real estate tokenization",
                "Supply chain tracking",
                "Event ticketing",
                "Loyalty programs"
              ]
            },
            {
              title: "Quantum Readiness",
              description: "Blockchain projects are preparing for the quantum computing era with new cryptographic approaches.",
              category: "Technology",
              color: "#2563eb",
              emoji: "⚛️",
              tldr: "Preparing blockchains for quantum future",
              timestamp: "1 week ago",
              bullets: [
                "Post-quantum cryptography",
                "Quantum-resistant algorithms",
                "Hybrid security solutions",
                "Migration strategies",
                "Research collaboration"
              ]
            }
          ].map((insight, index) => (
            <Pressable 
              key={index} 
              style={styles.insightCard}
              onPress={() => setSelectedInsight(insight)}
            >
              <View style={[styles.insightCategory, { backgroundColor: insight.color }]}>
                <Text style={styles.insightCategoryText}>{insight.category}</Text>
              </View>
              <Text style={styles.insightEmoji}>{insight.emoji}</Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightTimestamp}>{insight.timestamp}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              <Text style={styles.readMore}>Tap to read more →</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Resource Hub</Text>
        <View style={styles.resourceList}>
          {[
            {
              title: "DeFi Security Best Practices",
              type: "Presentation",
              downloads: 234,
              size: "15 MB",
              icon: "📊"
            },
            {
              title: "Web3 Gaming Market Report",
              type: "PDF",
              downloads: 189,
              size: "8 MB",
              icon: "📑"
            },
            {
              title: "AI Integration Workshop",
              type: "Video",
              downloads: 156,
              size: "45 MB",
              icon: "🎥"
            },
            {
              title: "Infrastructure Deep Dive",
              type: "Research",
              downloads: 142,
              size: "12 MB",
              icon: "📚"
            },
            {
              title: "Tokenomics Calculator",
              type: "Tool",
              downloads: 198,
              size: "3 MB",
              icon: "🔧"
            },
            {
              title: "Web3 UX Guidelines",
              type: "Template",
              downloads: 167,
              size: "6 MB",
              icon: "🎨"
            }
          ].map((resource, index) => (
            <View key={index} style={styles.resourceItem}>
              <View style={styles.resourceInfo}>
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceIcon}>{resource.icon}</Text>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                </View>
                <View style={styles.resourceMeta}>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                  <Text style={styles.resourceStats}>{resource.downloads} downloads • {resource.size}</Text>
                </View>
              </View>
              <Pressable style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>Download</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Expert Quotes</Text>
        <View style={styles.quotesList}>
          {[
            {
              quote: "The next bull market will be driven by real-world utility and institutional adoption.",
              author: "Sarah Chen",
              role: "DeFi Researcher",
              event: "Future of Finance Summit"
            },
            {
              quote: "Gaming is the trojan horse for mass web3 adoption. Focus on fun first, tokenomics second.",
              author: "Mike Johnson",
              role: "Gaming Lead",
              event: "GameFi Conference"
            }
          ].map((quote, index) => (
            <View key={index} style={styles.quoteCard}>
              <Text style={styles.quoteText}>"{quote.quote}"</Text>
              <View style={styles.quoteAuthor}>
                <Text style={styles.authorName}>{quote.author}</Text>
                <Text style={styles.authorRole}>{quote.role}</Text>
                <Text style={styles.eventName}>{quote.event}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        <View style={styles.topicsList}>
          {[
            { name: "Real World Assets", mentions: 156, growth: "+45%" },
            { name: "Zero Knowledge Proofs", mentions: 134, growth: "+38%" },
            { name: "Account Abstraction", mentions: 98, growth: "+25%" },
            { name: "Modular Blockchains", mentions: 87, growth: "+22%" }
          ].map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicMentions}>{topic.mentions} mentions</Text>
              </View>
              <Text style={styles.topicGrowth}>{topic.growth}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Projects</Text>
        <View style={styles.projectsList}>
          {[
            {
              name: "Modular Chain Hub",
              description: "Open-source toolkit for building and deploying modular blockchain solutions",
              stats: { 
                events: "23",
                attendees: "12.4K",
                engagement: "92%"
              },
              tags: ["Infrastructure", "Developer Tools"],
              color: "#8b5cf6"
            },
            {
              name: "EcoTrack DAO",
              description: "Decentralized carbon credit tracking and trading platform with AI-powered verification",
              stats: { 
                events: "18",
                mentions: "45.2K",
                growth: "+156%"
              },
              tags: ["Impact", "DeFi"],
              color: "#059669"
            },
            {
              name: "GameFi SDK",
              description: "Comprehensive SDK for integrating blockchain features into traditional games",
              stats: { 
                events: "15",
                reach: "89.3K",
                sentiment: "94%"
              },
              tags: ["Gaming", "Developer Tools"],
              color: "#22c55e"
            },
            {
              name: "AI Governance",
              description: "Framework for decentralized governance of AI models and datasets",
              stats: { 
                events: "12",
                followers: "34.8K",
                activity: "+78%"
              },
              tags: ["AI", "Governance"],
              color: "#ec4899"
            }
          ].map((project, index) => (
            <Pressable key={index} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={styles.projectTags}>
                  {project.tags.map((tag, tagIndex) => (
                    <View 
                      key={tagIndex} 
                      style={[styles.projectTag, { backgroundColor: project.color }]}
                    >
                      <Text style={styles.projectTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.projectDescription}>{project.description}</Text>
              <View style={styles.projectStats}>
                {Object.entries(project.stats).map(([key, value], statIndex) => (
                  <View key={statIndex} style={styles.projectStat}>
                    <Text style={styles.projectStatValue}>{value}</Text>
                    <Text style={styles.projectStatLabel}>{key}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
  
  const handleUpgradePress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(upgradeButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(upgradeButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    // Color change effect
    setUpgradeButtonColor('#3b82f6');
    
    // Show fireworks and navigate
    setShowFireworks(true);
    fireworksAnim.forEach((_, index) => {
      setTimeout(() => animateFirework(index), index * 200);
    });
    
    // Reset color and navigate after animation
    setTimeout(() => {
      setUpgradeButtonColor('#22c55e');
      setShowFireworks(false);
      router.push('/vip-benefits');
    }, 2000);
  };

  const animateFirework = (index: number) => {
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 300 - 150;

    fireworksAnim[index].position.setValue({ x: 0, y: 0 });
    fireworksAnim[index].scale.setValue(0);
    fireworksAnim[index].opacity.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(fireworksAnim[index].position, {
          toValue: { x: randomX, y: randomY },
          useNativeDriver: true,
          speed: 2,
          bounciness: 8
        }),
      ]),
      Animated.sequence([
        Animated.spring(fireworksAnim[index].scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 2,
        }),
        Animated.timing(fireworksAnim[index].scale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]),
      Animated.sequence([
        Animated.timing(fireworksAnim[index].opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          delay: 500
        })
      ])
    ]).start();
  };

  const renderVipLockOverlay = () => {
    return (
      <View style={styles.vipLockContainer}>
        {showFireworks && fireworksAnim.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.firework,
              {
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.position.x },
                  { translateY: anim.position.y },
                  { scale: anim.scale }
                ]
              }
            ]}
          />
        ))}
        <View style={styles.vipLockContent}>
          <Crown size={48} color={colors.primary} style={styles.vipIcon} />
          <Text style={styles.vipTitle}>Unlock Analytics</Text>
          <Text style={styles.vipDescription}>
            Upgrade to VIP to access detailed analytics including:
          </Text>
          <View style={styles.vipFeatures}>
            <View style={styles.vipFeatureItem}>
              <BarChart size={20} color={colors.primary} />
              <Text style={styles.vipFeatureText}>Monthly Trends & Growth</Text>
            </View>
            <View style={styles.vipFeatureItem}>
              <PieChart size={20} color={colors.primary} />
              <Text style={styles.vipFeatureText}>Category Distribution</Text>
            </View>
            <View style={styles.vipFeatureItem}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.vipFeatureText}>Attendance Analytics</Text>
            </View>
            <View style={styles.vipFeatureItem}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.vipFeatureText}>Price Range Analysis</Text>
            </View>
          </View>
          <Animated.View 
            style={[
              styles.upgradeButton,
              {
                backgroundColor: upgradeButtonColor,
                transform: [{ scale: upgradeButtonScale }]
              }
            ]}
          >
            <Pressable 
              onPress={handleUpgradePress}
              style={styles.upgradeButtonInner}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to VIP</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'trends' && styles.activeTab]}
            onPress={() => setActiveTab('trends')}
          >
            <TrendingUp size={20} color={activeTab === 'trends' ? colors.primary : colors.dark.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>Trends</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
            onPress={() => setActiveTab('categories')}
          >
            <PieChart size={20} color={activeTab === 'categories' ? colors.primary : colors.dark.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Categories</Text>
          </Pressable>

          <Pressable 
            style={[styles.tab, activeTab === 'socials' && styles.activeTab]}
            onPress={() => setActiveTab('socials')}
          >
            <Users size={20} color={activeTab === 'socials' ? colors.primary : colors.dark.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'socials' && styles.activeTabText]}>Socials</Text>
          </Pressable>

          <Pressable 
            style={[styles.tab, activeTab === 'takeaways' && styles.activeTab]}
            onPress={() => setActiveTab('takeaways')}
          >
            <Activity size={20} color={activeTab === 'takeaways' ? colors.primary : colors.dark.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'takeaways' && styles.activeTabText]}>Takeaways</Text>
          </Pressable>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'socials' && renderSocialsTab()}
        {activeTab === 'takeaways' && renderTakeawaysTab()}
      </ScrollView>
      {renderInsightModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.dark.background,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  sectionContainer: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barLabelContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  barValue: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  trendingRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingAttendees: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  trendingCategories: {
    flexDirection: 'row',
  },
  trendingCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  trendingCategoryText: {
    fontSize: 12,
    color: 'white',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.dark.background,
  },
  categoryLegend: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendCategory: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.text,
  },
  legendPercentage: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginRight: 4,
  },
  legendCount: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  monthlyItem: {
    marginBottom: 16,
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthlyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  monthlyCount: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  monthlyBar: {
    height: 8,
    backgroundColor: colors.dark.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  monthlyBarFill: {
    height: '100%',
  },
  monthlyBarGradient: {
    height: '100%',
    width: '100%',
  },
  priceRanges: {
    marginTop: 8,
  },
  priceRange: {
    marginBottom: 12,
  },
  priceRangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceRangeLabel: {
    fontSize: 14,
    color: colors.dark.text,
  },
  priceRangeCount: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  priceRangeBar: {
    height: 6,
    backgroundColor: colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  priceRangeFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeSlots: {
    marginTop: 8,
  },
  timeSlot: {
    marginBottom: 12,
  },
  timeSlotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeSlotLabel: {
    fontSize: 14,
    color: colors.dark.text,
  },
  timeSlotCount: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  timeSlotBar: {
    height: 6,
    backgroundColor: colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timeSlotFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryGrowth: {
    marginTop: 8,
  },
  growthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  growthCategory: {
    fontSize: 14,
    color: colors.dark.text,
    flex: 1,
  },
  growthData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthRate: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  growthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vipLockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
  vipLockContent: {
    backgroundColor: colors.dark.card,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  vipIcon: {
    marginBottom: 16,
  },
  vipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 8,
  },
  vipDescription: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  vipFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vipFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipFeatureText: {
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 8,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  upgradeButtonInner: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  firework: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10000,
  },
  sentimentContainer: {
    marginTop: 8,
  },
  meterContainer: {
    marginBottom: 20,
  },
  meterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  gauge: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.dark.border,
  },
  gaugeBackground: {
    width: '100%',
    height: '100%',
  },
  gaugeNeedle: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 2,
    height: '90%',
    backgroundColor: colors.dark.text,
    transformOrigin: 'bottom',
  },
  needleCircle: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.dark.text,
  },
  needleLine: {
    position: 'absolute',
    top: 0,
    left: 4,
    width: 2,
    height: '100%',
    backgroundColor: colors.dark.text,
  },
  gaugeValue: {
    alignItems: 'center',
    marginTop: 16,
  },
  gaugeNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.dark.text,
  },
  gaugeMood: {
    fontSize: 18,
    color: '#f97316',
    fontWeight: '600',
    marginTop: 4,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  gaugeLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  gaugeSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  bubbleMapContainer: {
    marginTop: 8,
  },
  bubbleMap: {
    width: '100%',
    height: 200,
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    position: 'relative',
  },
  bubbleLocation: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  bubbleCity: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bubbleEvents: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  bubbleMapLegend: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  insightsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  insightCard: {
    width: 280,
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  insightCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  insightEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  insightTimestamp: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.dark.text,
    lineHeight: 28,
  },
  modalScroll: {
    maxHeight: '90%',
  },
  modalEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 16,
  },
  tldrContainer: {
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tldrLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  tldrText: {
    fontSize: 16,
    color: colors.dark.text,
    fontStyle: 'italic',
  },
  bulletContainer: {
    gap: 12,
  },
  bulletTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletEmoji: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
    lineHeight: 24,
  },
  resourceList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 12,
  },
  resourceInfo: {
    flex: 1,
    marginRight: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resourceIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  resourceStats: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quotesList: {
    gap: 16,
  },
  quoteCard: {
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 16,
  },
  quoteText: {
    fontSize: 16,
    color: colors.dark.text,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  quoteAuthor: {
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  authorRole: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  eventName: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  topicsList: {
    gap: 12,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  topicMentions: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  topicGrowth: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  projectsList: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    flex: 1,
    marginRight: 12,
  },
  projectTags: {
    flexDirection: 'row',
    gap: 8,
  },
  projectTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  projectTagText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  projectStat: {
    alignItems: 'center',
  },
  projectStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  projectStatLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textTransform: 'capitalize',
  },
  sentimentChart: {
    gap: 16,
  },
  sentimentItem: {
    backgroundColor: colors.dark.background,
    borderRadius: 12,
    padding: 12,
  },
  sentimentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sentimentPlatform: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  sentimentBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.dark.text,
    lineHeight: 24,
    marginBottom: 16,
  }
});
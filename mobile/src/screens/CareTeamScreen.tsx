import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { ChevronLeftIcon, CloseIcon, CheckIcon, SparkleIcon } from '../components/Icons';

interface CareTeamScreenProps {
  onBack?: () => void;
}

interface Specialist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: string;
  reviews: string;
  exp: string;
  avatar: any;
  availableSlot: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'dr-ananya',
    name: 'Dr. Ananya Sharma',
    role: 'Lead Clinical Nutritionist',
    specialty: 'PCOS, Hormonal Health & Thyroid',
    rating: '4.9',
    reviews: '124',
    exp: '9 yrs',
    avatar: require('../../assets/images/nutritionist-ananya.webp'),
    availableSlot: 'Tomorrow, 4:00 PM',
  },
  {
    id: 'dr-neha',
    name: 'Neha Patel, RD',
    role: 'Clinical Dietitian',
    specialty: 'Gut Microbiome & Bloating Relief',
    rating: '4.8',
    reviews: '98',
    exp: '7 yrs',
    avatar: require('../../assets/images/coach-av-neha.png'),
    availableSlot: 'Thu, 11:30 AM',
  },
  {
    id: 'arjun-verma',
    name: 'Arjun Verma, MS',
    role: 'Metabolic & Fitness Coach',
    specialty: 'Strength, Insulin Resistance & T2D',
    rating: '4.9',
    reviews: '156',
    exp: '8 yrs',
    avatar: require('../../assets/images/coach-av-arjun.png'),
    availableSlot: 'Fri, 2:00 PM',
  },
  {
    id: 'ritika-roy',
    name: 'Ritika Roy',
    role: 'Integrative Nutritionist',
    specialty: 'Mindful Eating & Plant-Rich Nutrition',
    rating: '4.8',
    reviews: '82',
    exp: '6 yrs',
    avatar: require('../../assets/images/coach-av-ritika.png'),
    availableSlot: 'Sat, 10:00 AM',
  },
];

export const CareTeamScreen: React.FC<CareTeamScreenProps> = ({ onBack }) => {
  const [bookedSpecialist, setBookedSpecialist] = useState<string | null>(null);

  const handleBook = (name: string, slot: string) => {
    setBookedSpecialist(name);
    Alert.alert(
      'Consultation Scheduled',
      `Your video consultation with ${name} is reserved for ${slot}. You will receive a calendar invitation and pre-consultation assessment checklist.`
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#1C1D1A" />
        </TouchableOpacity>
        <Text style={styles.barTitle}>Care Team & Experts</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={styles.headerSection}>
          <Text style={styles.kicker}>HOLISTIC CLINICAL CARE</Text>
          <Text style={styles.pageTitle}>Work With Certified Specialists</Text>
          <Text style={styles.pageSubtitle}>
            Personalized 1-on-1 guidance from clinical nutritionists, hormone health dietitians, and metabolic specialists.
          </Text>
        </View>

        {/* Specialists List */}
        <View style={styles.specialistsList}>
          {SPECIALISTS.map((spec) => {
            const isBooked = bookedSpecialist === spec.name;
            return (
              <View key={spec.id} style={styles.specCard}>
                <View style={styles.specHeaderRow}>
                  <Image source={spec.avatar} style={styles.specAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specName}>{spec.name}</Text>
                    <Text style={styles.specRole}>{spec.role}</Text>
                    <View style={styles.badgeRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SparkleIcon size={11} color="#D97706" style={{ marginRight: 3 }} />
                        <Text style={styles.ratingText}>{spec.rating}</Text>
                      </View>
                      <Text style={styles.reviewsText}>({spec.reviews})</Text>
                      <Text style={styles.dotSep}>•</Text>
                      <Text style={styles.expText}>{spec.exp} experience</Text>
                    </View>
                  </View>
                </View>

                {/* Focus Specialty Pill */}
                <View style={styles.specialtyPill}>
                  <Text style={styles.specialtyText}>Focus: {spec.specialty}</Text>
                </View>

                {/* Booking Bar */}
                <View style={styles.bookingBar}>
                  <View>
                    <Text style={styles.nextSlotLabel}>Next available:</Text>
                    <Text style={styles.nextSlotValue}>{spec.availableSlot}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.bookBtn, isBooked && styles.bookBtnDone]}
                    onPress={() => handleBook(spec.name, spec.availableSlot)}
                    activeOpacity={0.8}
                  >
                    {isBooked && <CheckIcon size={11} color="#FFFFFF" style={{ marginRight: 4 }} />}
                    <Text style={[styles.bookBtnText, isBooked && styles.bookBtnTextDone]}>
                      {isBooked ? 'Booked' : 'Book Session'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7EE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  headerSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#3D5C3E',
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1D1A',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#686B63',
    lineHeight: 18,
    marginTop: 4,
  },
  specialistsList: {
    gap: 16,
  },
  specCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    padding: 16,
  },
  specHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  specName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1C1D1A',
  },
  specRole: {
    fontSize: 12,
    color: '#686B63',
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  reviewsText: {
    fontSize: 11,
    color: '#737970',
    marginLeft: 2,
  },
  dotSep: {
    color: '#C5C1B8',
    marginHorizontal: 6,
    fontSize: 10,
  },
  expText: {
    fontSize: 11,
    color: '#52604D',
    fontWeight: '500',
  },
  specialtyPill: {
    backgroundColor: '#F7F4EC',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  specialtyText: {
    fontSize: 11.5,
    color: '#343831',
    fontWeight: '500',
  },
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3EFE7',
    paddingTop: 12,
  },
  nextSlotLabel: {
    fontSize: 10,
    color: '#737970',
  },
  nextSlotValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1D1A',
    marginTop: 1,
  },
  bookBtn: {
    backgroundColor: '#5C6E52',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bookBtnDone: {
    backgroundColor: '#EAF0E6',
    borderWidth: 1,
    borderColor: '#5C6E52',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  bookBtnTextDone: {
    color: '#264428',
  },
});


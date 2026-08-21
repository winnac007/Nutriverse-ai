export type ExpertTypeId =
  | "nutritionist"
  | "health-specialist"
  | "wellness-coach"
  | "sports-nutritionist"
  | "bodybuilding-coach"
  | "fitness-trainer";

export type ConsultationMode = "chat" | "video" | "audio";

export type ConsultantReview = {
  by: string;
  stars: number;
  text: string;
};

export type Consultant = {
  id: string;
  name: string;
  title: string;
  type: ExpertTypeId;
  photo: string;
  rating: number;
  reviewsCount: number;
  yearsExperience: number;
  consultations: number;
  feeInr: number;
  sessionMinutes: number;
  available: boolean;
  specialties: string[];
  languages: string[];
  location: string;
  about: string;
  areas: string[];
  education: {
    degree: string;
    school: string;
  };
  certifications: string[];
  reviews: ConsultantReview[];
  topMatch?: boolean;
};

export const EXPERT_TYPES = [
  {
    id: "nutritionist" as const,
    label: "Nutritionist",
    blurb: "Personalized meal guidance and condition-specific nutrition.",
  },
  {
    id: "health-specialist" as const,
    label: "Health Specialist",
    blurb: "Discuss health concerns, review reports and get medical guidance.",
  },
  {
    id: "wellness-coach" as const,
    label: "Mind & Wellness",
    blurb: "Support for stress, mindful eating and lifestyle balance.",
  },
  {
    id: "sports-nutritionist" as const,
    label: "Sports Nutritionist",
    blurb: "Fuel training with macros that match your training phase.",
  },
  {
    id: "bodybuilding-coach" as const,
    label: "Bodybuilding Coach",
    blurb: "Bulking, cutting, contest prep — food and programming.",
  },
  {
    id: "fitness-trainer" as const,
    label: "Fitness Trainer",
    blurb: "Personal training paired with everyday nutrition guidance.",
  },
];

export const HEALTH_CONCERNS = [
  { id: "pcos", label: "PCOS", terms: ["pcos", "hormone", "women's health"] },
  { id: "diabetes", label: "Diabetes", terms: ["diabetes", "blood sugar", "pre-diabetes"] },
  { id: "thyroid", label: "Thyroid", terms: ["thyroid"] },
  { id: "weight", label: "Weight", terms: ["weight", "weight loss", "active lifestyle"] },
  { id: "digestive", label: "Digestive", terms: ["gut", "digestive", "microbiome"] },
] as const;

export type HealthConcernId = (typeof HEALTH_CONCERNS)[number]["id"];

export const CONSULTATION_MODES = [
  { id: "chat" as const, label: "Chat", description: "Ask questions and get advice." },
  { id: "video" as const, label: "Video", description: "One-to-one consultation." },
  { id: "audio" as const, label: "Audio", description: "Talk over a call." },
];

export const CONSULTANTS: Consultant[] = [
  {
    id: "e-001",
    name: "Dt. Ananya Sharma",
    title: "Clinical Nutritionist",
    type: "nutritionist",
    photo: "/app-ui/nutritionist-ananya.webp",
    rating: 4.9,
    reviewsCount: 120,
    yearsExperience: 8,
    consultations: 1000,
    feeInr: 800,
    sessionMinutes: 45,
    available: true,
    specialties: ["PCOS", "Hormone Balance", "Weight Management"],
    languages: ["Hindi", "English"],
    location: "Mumbai, India",
    about: "Food is powerful medicine. My goal is to help you build a healthy relationship with food and achieve balance in your body and mind.",
    areas: ["PCOS", "Hormone Balance", "Weight Management", "Gut Health", "Thyroid", "Women's Health", "Lifestyle Nutrition"],
    education: {
      degree: "M.Sc Clinical Nutrition & Dietetics",
      school: "SNDT Women's University, Mumbai",
    },
    certifications: ["Certificate in PCOS Nutrition", "Diabetes Educator Certification", "Weight Management Specialist"],
    reviews: [
      {
        by: "Neha S.",
        stars: 5,
        text: "Ananya is patient and understanding. Her PCOS plan has helped my energy levels and overall health.",
      },
      {
        by: "Riya P.",
        stars: 5,
        text: "Practical, non-judgmental and effective. The recommendations fit into everyday life.",
      },
    ],
    topMatch: true,
  },
  {
    id: "e-002",
    name: "Dt. Meera Iyer",
    title: "Nutritionist & Diabetes Educator",
    type: "nutritionist",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
    rating: 4.8,
    reviewsCount: 120,
    yearsExperience: 10,
    consultations: 800,
    feeInr: 700,
    sessionMinutes: 45,
    available: true,
    specialties: ["Diabetes", "Thyroid", "Heart Health"],
    languages: ["Tamil", "English", "Hindi"],
    location: "Chennai, India",
    about: "I help people with lifestyle conditions build sustainable, culturally rooted meal habits without giving up flavour.",
    areas: ["Diabetes", "Thyroid", "Heart Health", "Cholesterol", "Blood Pressure"],
    education: {
      degree: "M.Sc Dietetics & Food Service Management",
      school: "Madras University",
    },
    certifications: ["Certified Diabetes Educator", "Cardiac Nutrition Specialist"],
    reviews: [{ by: "Karthik R.", stars: 5, text: "A practical food-first approach that worked with the meals my family already cooks." }],
  },
  {
    id: "e-003",
    name: "Dt. Riya Malhotra",
    title: "Sports & Clinical Nutritionist",
    type: "nutritionist",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
    rating: 4.9,
    reviewsCount: 76,
    yearsExperience: 6,
    consultations: 500,
    feeInr: 900,
    sessionMinutes: 45,
    available: true,
    specialties: ["Weight Management", "Gut Health", "Active Lifestyle"],
    languages: ["English", "Hindi"],
    location: "Delhi, India",
    about: "Nutrition for people who train hard and want to feel light. Performance meets balance.",
    areas: ["Sports Nutrition", "Weight Management", "Gut Health", "Muscle Gain", "Endurance"],
    education: { degree: "M.Sc Sports Nutrition", school: "IGNOU" },
    certifications: ["ISSN Certified Sports Nutritionist", "Gut Microbiome Specialist"],
    reviews: [{ by: "Aarav K.", stars: 5, text: "I became stronger while steadily moving toward my weight goal." }],
  },
  {
    id: "e-004",
    name: "Dr. Priya Sharma",
    title: "Health Specialist & Diabetologist",
    type: "health-specialist",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80",
    rating: 4.8,
    reviewsCount: 98,
    yearsExperience: 12,
    consultations: 1500,
    feeInr: 1200,
    sessionMinutes: 30,
    available: false,
    specialties: ["Diabetes", "Thyroid", "Weight Wellness"],
    languages: ["English", "Hindi", "Punjabi"],
    location: "Delhi, India",
    about: "Medical review paired with a personalized lifestyle plan, especially when laboratory reports need context.",
    areas: ["Diabetes", "Thyroid", "Cholesterol", "Blood Pressure", "Pre-diabetes"],
    education: { degree: "MBBS, MD (Internal Medicine)", school: "AIIMS Delhi" },
    certifications: ["Board Certified Diabetologist", "Advanced Lipidology"],
    reviews: [{ by: "Vikram J.", stars: 5, text: "My reports were explained clearly and turned into a plan I could actually follow." }],
  },
  {
    id: "e-005",
    name: "Kavya Nair",
    title: "Mindful Eating Coach",
    type: "wellness-coach",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    rating: 4.9,
    reviewsCount: 64,
    yearsExperience: 5,
    consultations: 400,
    feeInr: 600,
    sessionMinutes: 60,
    available: true,
    specialties: ["Mindful Eating", "Stress Reduction", "Sleep"],
    languages: ["English", "Malayalam", "Hindi"],
    location: "Bangalore, India",
    about: "Guiding you toward a calmer relationship with food — fewer restrictions and more awareness.",
    areas: ["Mindful Eating", "Emotional Eating", "Stress Reduction", "Sleep Hygiene", "Habit Change"],
    education: { degree: "MA Psychology", school: "Christ University, Bangalore" },
    certifications: ["Certified Mindfulness Facilitator", "Intuitive Eating Counselor"],
    reviews: [{ by: "Anita M.", stars: 5, text: "I finally stopped fighting food and started understanding my habits." }],
  },
  {
    id: "e-006",
    name: "Dt. Aditya Verma",
    title: "Sports Nutritionist",
    type: "sports-nutritionist",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    rating: 4.7,
    reviewsCount: 52,
    yearsExperience: 7,
    consultations: 350,
    feeInr: 850,
    sessionMinutes: 45,
    available: true,
    specialties: ["Muscle Gain", "Cutting", "Endurance"],
    languages: ["English", "Hindi"],
    location: "Pune, India",
    about: "Strength phases, cutting phases and competition prep with food that fits the training block.",
    areas: ["Muscle Gain", "Cutting", "Endurance", "Recovery", "Supplement Guidance"],
    education: { degree: "M.Sc Sports Sciences", school: "SAI, Pune" },
    certifications: ["ISSN CISSN", "Precision Nutrition L2"],
    reviews: [{ by: "Rohan D.", stars: 5, text: "The plan helped me preserve strength while cutting steadily." }],
  },
  {
    id: "e-007",
    name: "Coach Vikram Rao",
    title: "Bodybuilding & Contest Prep Coach",
    type: "bodybuilding-coach",
    photo: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
    rating: 4.9,
    reviewsCount: 88,
    yearsExperience: 11,
    consultations: 600,
    feeInr: 1200,
    sessionMinutes: 60,
    available: true,
    specialties: ["Bulking", "Cutting", "Contest Prep"],
    languages: ["English", "Hindi", "Kannada"],
    location: "Bangalore, India",
    about: "An IFBB-affiliated approach to peaks, cuts and stage-ready physiques with nutrition and training aligned.",
    areas: ["Bulking", "Cutting", "Contest Prep", "Physique Assessment", "Progressive Overload"],
    education: { degree: "B.Sc Exercise Science", school: "Kingston University" },
    certifications: ["NASM CPT", "IFBB Pro Coach", "Precision Nutrition L1"],
    reviews: [{ by: "Amit S.", stars: 5, text: "The prep was disciplined, clear and much more sustainable than I expected." }],
  },
  {
    id: "e-008",
    name: "Trainer Isha Kapoor",
    title: "Certified Fitness Trainer",
    type: "fitness-trainer",
    photo: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80",
    rating: 4.8,
    reviewsCount: 64,
    yearsExperience: 6,
    consultations: 420,
    feeInr: 600,
    sessionMinutes: 45,
    available: true,
    specialties: ["Weight Loss", "Functional Fitness", "Home Workouts"],
    languages: ["English", "Hindi"],
    location: "Gurgaon, India",
    about: "Everyday fitness for busy people. Realistic workouts paired with realistic meals.",
    areas: ["Weight Loss", "Home Workouts", "Functional Fitness", "Beginners", "Post-Natal Fitness"],
    education: { degree: "B.P.Ed", school: "LNIPE Gwalior" },
    certifications: ["ACE CPT", "Kettlebell L1", "Pre/Post-Natal Certified"],
    reviews: [{ by: "Meera G.", stars: 5, text: "Isha made fitness feel doable without any crash diet or extreme routine." }],
  },
];

const CONDITION_ALIASES: Record<string, HealthConcernId> = {
  pcos: "pcos",
  pcod: "pcos",
  diabetes: "diabetes",
  prediabetes: "diabetes",
  "diabetes-t1": "diabetes",
  "diabetes-t2": "diabetes",
  "insulin-resistance": "diabetes",
  thyroid: "thyroid",
  hypothyroid: "thyroid",
  hyperthyroid: "thyroid",
  obesity: "weight",
  "weight-management": "weight",
  "weight-loss": "weight",
  ibs: "digestive",
  gerd: "digestive",
  "gut-health": "digestive",
  celiac: "digestive",
};

export function resolveHealthConcern(conditions: string[] | undefined): HealthConcernId | null {
  for (const condition of conditions ?? []) {
    const normalized = condition.trim().toLowerCase().replaceAll("_", "-").replaceAll(" ", "-");
    const match = CONDITION_ALIASES[normalized];
    if (match) return match;
  }
  return null;
}

export function consultantMatchesConcern(consultant: Consultant, concernId: HealthConcernId) {
  const concern = HEALTH_CONCERNS.find((item) => item.id === concernId);
  if (!concern) return true;
  const searchable = [consultant.title, ...consultant.specialties, ...consultant.areas].join(" ").toLowerCase();
  return concern.terms.some((term) => searchable.includes(term));
}

export function getConsultant(id: string) {
  return CONSULTANTS.find((consultant) => consultant.id === id);
}

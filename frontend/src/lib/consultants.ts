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
  category?: "Nutrition" | "Fitness" | "Lifestyle" | "Mindfulness";
  photo: string;
  heroImage?: string;
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
  education?: {
    degree: string;
    school: string;
  };
  qualifications?: string[];
  certifications: string[];
  reviews: (ConsultantReview & { avatar?: string })[];
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
    id: "dr-neha-sharma",
    name: "Dr. Neha Sharma",
    title: "Nutritionist & Dietitian",
    type: "nutritionist",
    category: "Nutrition",
    photo: "/app-ui/coach-av-neha.png",
    heroImage: "/app-ui/coach-hero-neha.png",
    rating: 4.9,
    reviewsCount: 120,
    yearsExperience: 8,
    consultations: 1200,
    feeInr: 800,
    sessionMinutes: 45,
    available: true,
    specialties: ["PCOS", "Diabetes", "Weight Loss", "Gut Health"],
    languages: ["Hindi", "English"],
    location: "Mumbai, India",
    about: "Neha believes that food is medicine when used right. She helps her clients build a balanced relationship with food and achieve sustainable results.",
    areas: ["PCOS", "Diabetes", "Weight Loss", "Gut Health", "Hormonal Balance", "Clinical Nutrition"],
    education: {
      degree: "MSc Nutrition & Dietetics",
      school: "AIIMS Delhi",
    },
    qualifications: [
      "MSc Nutrition & Dietetics",
      "Certified Diabetes Educator",
    ],
    certifications: ["Certified Diabetes Educator", "Clinical Nutrition Specialist"],
    reviews: [
      {
        by: "Priya S.",
        stars: 5,
        text: "Neha ma'am is amazing! Her meal plans are so easy to follow and very effective.",
        avatar: "/app-ui/coach-client-priya.png",
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
    id: "arjun-mehta",
    name: "Arjun Mehta",
    title: "Fitness Coach",
    type: "fitness-trainer",
    category: "Fitness",
    photo: "/app-ui/coach-av-arjun.png",
    heroImage: "/app-ui/coach-hero-arjun.png",
    rating: 4.8,
    reviewsCount: 98,
    yearsExperience: 7,
    consultations: 850,
    feeInr: 900,
    sessionMinutes: 45,
    available: true,
    specialties: ["Strength", "Fat Loss", "Muscle Gain", "Performance"],
    languages: ["English", "Hindi"],
    location: "Delhi, India",
    about: "Arjun helps you move better, get stronger and build a body you feel proud of. Fitness that fits your lifestyle.",
    areas: ["Strength", "Fat Loss", "Muscle Gain", "Performance", "Endurance"],
    education: {
      degree: "B.Sc Exercise Science",
      school: "Delhi University",
    },
    qualifications: [
      "ACE Certified Personal Trainer",
      "Strength & Conditioning Specialist",
    ],
    certifications: [
      "ACE Certified Personal Trainer",
      "Strength & Conditioning Specialist",
    ],
    reviews: [
      {
        by: "Rohan M.",
        stars: 5,
        text: "I've never been this consistent with my workouts. Arjun is the best!",
        avatar: "/app-ui/coach-client-rohan.png",
      },
    ],
    topMatch: true,
  },
  {
    id: "ritika-malhotra",
    name: "Ritika Malhotra",
    title: "Holistic Wellness Coach",
    type: "wellness-coach",
    category: "Mindfulness",
    photo: "/app-ui/coach-av-ritika.png",
    heroImage: "/app-ui/coach-hero-ritika.png",
    rating: 4.9,
    reviewsCount: 86,
    yearsExperience: 6,
    consultations: 640,
    feeInr: 850,
    sessionMinutes: 50,
    available: true,
    specialties: ["Stress Management", "Sleep Wellness", "Hormonal Balance", "Mindfulness"],
    languages: ["English", "Hindi"],
    location: "Bangalore, India",
    about: "Ritika takes a holistic approach to wellness by addressing mind, body and lifestyle together for lasting transformation.",
    areas: ["Stress Management", "Sleep Wellness", "Hormonal Balance", "Mindfulness", "Emotional Wellness"],
    education: {
      degree: "MA Psychology & Mindfulness",
      school: "Christ University, Bangalore",
    },
    qualifications: [
      "Certified Wellness Coach",
      "Mindfulness & Stress Reduction Coach",
    ],
    certifications: [
      "Certified Wellness Coach",
      "Mindfulness & Stress Reduction Coach",
    ],
    reviews: [
      {
        by: "Ananya P.",
        stars: 5,
        text: "Ritika's guidance has helped me manage my stress and sleep so much better.",
        avatar: "/app-ui/coach-client-ananya.png",
      },
    ],
    topMatch: true,
  },
  {
    id: "dr-kavya-iyer",
    name: "Dr. Kavya Iyer",
    title: "Clinical Nutritionist",
    type: "nutritionist",
    category: "Nutrition",
    photo: "/app-ui/coach-av-kavya.png",
    heroImage: "/app-ui/coach-hero-neha.png",
    rating: 4.8,
    reviewsCount: 104,
    yearsExperience: 5,
    consultations: 580,
    feeInr: 750,
    sessionMinutes: 45,
    available: true,
    specialties: ["Thyroid", "Gut Health", "Heart Health"],
    languages: ["English", "Tamil", "Hindi"],
    location: "Chennai, India",
    about: "Dr. Kavya specializes in clinical medical nutrition therapy for thyroid regulation and gastrointestinal harmony.",
    areas: ["Thyroid", "Gut Health", "Heart Health", "Metabolic Health"],
    education: {
      degree: "MD Clinical Nutrition",
      school: "Madras Medical College",
    },
    qualifications: [
      "MD Clinical Nutrition",
      "Certified Gut Health Specialist",
    ],
    certifications: ["Certified Gut Health Specialist", "Thyroid Care Educator"],
    reviews: [
      {
        by: "Sunita R.",
        stars: 5,
        text: "Dr. Kavya's guidance on thyroid nutrition transformed my daily energy.",
        avatar: "/app-ui/coach-client-priya.png",
      },
    ],
  },
  {
    id: "yash-vardhan",
    name: "Yash Vardhan",
    title: "Lifestyle & Mindset Coach",
    type: "wellness-coach",
    category: "Lifestyle",
    photo: "/app-ui/coach-av-yash.png",
    heroImage: "/app-ui/coach-hero-arjun.png",
    rating: 4.7,
    reviewsCount: 72,
    yearsExperience: 5,
    consultations: 430,
    feeInr: 700,
    sessionMinutes: 45,
    available: true,
    specialties: ["Mindfulness", "Habits", "Productivity"],
    languages: ["English", "Hindi"],
    location: "Pune, India",
    about: "Yash helps busy professionals construct sustainable lifestyle architectures, combining mindfulness with habit loops.",
    areas: ["Mindfulness", "Habits", "Productivity", "Time Management", "Sleep"],
    education: {
      degree: "B.Sc Behavioral Psychology",
      school: "Symbiosis Pune",
    },
    qualifications: [
      "Behavioral Change Specialist",
      "Certified Habit Coach",
    ],
    certifications: ["Behavioral Change Specialist", "Certified Habit Coach"],
    reviews: [
      {
        by: "Sameer K.",
        stars: 5,
        text: "Yash helped me break self-sabotaging burnout cycles with tiny daily shifts.",
        avatar: "/app-ui/coach-client-rohan.png",
      },
    ],
  },
  {
    id: "e-001",
    name: "Dr. Neha Sharma",
    title: "Nutritionist & Dietitian",
    type: "nutritionist",
    category: "Nutrition",
    photo: "/app-ui/coach-av-neha.png",
    heroImage: "/app-ui/coach-hero-neha.png",
    rating: 4.9,
    reviewsCount: 120,
    yearsExperience: 8,
    consultations: 1200,
    feeInr: 800,
    sessionMinutes: 45,
    available: true,
    specialties: ["PCOS", "Diabetes", "Weight Loss", "Gut Health"],
    languages: ["Hindi", "English"],
    location: "Mumbai, India",
    about: "Neha believes that food is medicine when used right. She helps her clients build a balanced relationship with food and achieve sustainable results.",
    areas: ["PCOS", "Diabetes", "Weight Loss", "Gut Health", "Hormonal Balance", "Clinical Nutrition"],
    education: {
      degree: "MSc Nutrition & Dietetics",
      school: "AIIMS Delhi",
    },
    qualifications: [
      "MSc Nutrition & Dietetics",
      "Certified Diabetes Educator",
    ],
    certifications: ["Certified Diabetes Educator", "Clinical Nutrition Specialist"],
    reviews: [
      {
        by: "Priya S.",
        stars: 5,
        text: "Neha ma'am is amazing! Her meal plans are so easy to follow and very effective.",
        avatar: "/app-ui/coach-client-priya.png",
      },
    ],
    topMatch: true,
  },
  {
    id: "e-002",
    name: "Arjun Mehta",
    title: "Fitness Coach",
    type: "fitness-trainer",
    category: "Fitness",
    photo: "/app-ui/coach-av-arjun.png",
    heroImage: "/app-ui/coach-hero-arjun.png",
    rating: 4.8,
    reviewsCount: 98,
    yearsExperience: 7,
    consultations: 850,
    feeInr: 900,
    sessionMinutes: 45,
    available: true,
    specialties: ["Strength", "Fat Loss", "Muscle Gain", "Performance"],
    languages: ["English", "Hindi"],
    location: "Delhi, India",
    about: "Arjun helps you move better, get stronger and build a body you feel proud of. Fitness that fits your lifestyle.",
    areas: ["Strength", "Fat Loss", "Muscle Gain", "Performance"],
    education: {
      degree: "B.Sc Exercise Science",
      school: "Delhi University",
    },
    qualifications: [
      "ACE Certified Personal Trainer",
      "Strength & Conditioning Specialist",
    ],
    certifications: [
      "ACE Certified Personal Trainer",
      "Strength & Conditioning Specialist",
    ],
    reviews: [
      {
        by: "Rohan M.",
        stars: 5,
        text: "I've never been this consistent with my workouts. Arjun is the best!",
        avatar: "/app-ui/coach-client-rohan.png",
      },
    ],
  },
  {
    id: "e-003",
    name: "Ritika Malhotra",
    title: "Holistic Wellness Coach",
    type: "wellness-coach",
    category: "Mindfulness",
    photo: "/app-ui/coach-av-ritika.png",
    heroImage: "/app-ui/coach-hero-ritika.png",
    rating: 4.9,
    reviewsCount: 86,
    yearsExperience: 6,
    consultations: 640,
    feeInr: 850,
    sessionMinutes: 50,
    available: true,
    specialties: ["Stress Management", "Sleep Wellness", "Hormonal Balance", "Mindfulness"],
    languages: ["English", "Hindi"],
    location: "Bangalore, India",
    about: "Ritika takes a holistic approach to wellness by addressing mind, body and lifestyle together for lasting transformation.",
    areas: ["Stress Management", "Sleep Wellness", "Hormonal Balance", "Mindfulness"],
    education: {
      degree: "MA Psychology & Mindfulness",
      school: "Christ University, Bangalore",
    },
    qualifications: [
      "Certified Wellness Coach",
      "Mindfulness & Stress Reduction Coach",
    ],
    certifications: [
      "Certified Wellness Coach",
      "Mindfulness & Stress Reduction Coach",
    ],
    reviews: [
      {
        by: "Ananya P.",
        stars: 5,
        text: "Ritika's guidance has helped me manage my stress and sleep so much better.",
        avatar: "/app-ui/coach-client-ananya.png",
      },
    ],
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
  const normalizedId = id.trim().toLowerCase();
  return CONSULTANTS.find(
    (consultant) =>
      consultant.id.toLowerCase() === normalizedId ||
      consultant.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === normalizedId ||
      consultant.name.toLowerCase().replace(/^dr\.?\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === normalizedId
  );
}

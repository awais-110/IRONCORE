export type Program = {
  id: string;
  index: string;
  name: string;
  monthly: number;
  annual: number;
  description: string;
  features: string[];
  featured?: boolean;
};

export type Trainer = {
  slug: string;
  index: string;
  name: string;
  specialty: string;
  shortBio: string;
  bio: string;
  image: string;
  certifications: string[];
  quote: string;
  instagram: string;
};

export type GymClass = {
  id: string;
  name: string;
  day: string;
  start: string;
  end: string;
  trainer: string;
  trainerSlug: string;
  intensity: 1 | 2 | 3;
  type: "Strength" | "Conditioning" | "Mobility" | "Hybrid";
  spotsLeft: number;
};

export const programs: Program[] = [
  {
    id: "foundation",
    index: "001",
    name: "Foundation",
    monthly: 59,
    annual: 590,
    description: "Build a serious base with full-floor access and a plan that keeps you moving.",
    features: ["Open gym access", "2 coached classes / week", "Quarterly movement screen", "Training app access"]
  },
  {
    id: "performance",
    index: "002",
    name: "Performance",
    monthly: 89,
    annual: 890,
    description: "Structured coaching and more weekly work for athletes chasing measurable progress.",
    features: ["Unlimited coached classes", "Monthly coach check-in", "Custom strength block", "Recovery zone access"],
    featured: true
  },
  {
    id: "elite",
    index: "003",
    name: "Elite",
    monthly: 139,
    annual: 1390,
    description: "High-touch coaching, individual programming, and accountability without excuses.",
    features: ["Everything in Performance", "Weekly 1:1 coaching", "Individual nutrition targets", "Priority class booking"]
  }
];

export const trainers: Trainer[] = [
  {
    slug: "maya-stone",
    index: "001",
    name: "Maya Stone",
    specialty: "Powerlifting",
    shortBio: "Technique-first strength coach for lifters ready to own the big three.",
    bio: "Maya turns intimidating lifts into repeatable skills. Her coaching balances precise barbell mechanics with programming that builds confidence under load.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
    certifications: ["NSCA Certified Strength & Conditioning Specialist", "USAPL Club Coach", "Precision Nutrition L1"],
    quote: "Strength is not found. It is practiced, rep by honest rep.",
    instagram: "@mayastone.strength"
  },
  {
    slug: "marcus-reed",
    index: "002",
    name: "Marcus Reed",
    specialty: "Conditioning",
    shortBio: "Engine builder for competitors, weekend athletes, and anyone tired of fading.",
    bio: "Marcus programs conditioning that transfers beyond the gym. Expect smart intervals, direct feedback, and a standard that rises with your capacity.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    certifications: ["CrossFit Level 2 Trainer", "USA Weightlifting L1", "First Aid / CPR"],
    quote: "Your engine should be as dependable as your strongest lift.",
    instagram: "@marcus.moves"
  },
  {
    slug: "elena-park",
    index: "003",
    name: "Elena Park",
    specialty: "Mobility",
    shortBio: "Movement specialist helping strong bodies stay useful, resilient, and pain-free.",
    bio: "Elena bridges strength and mobility so athletes can train hard for longer. Her sessions are practical, progressive, and built around the demands of real training.",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=85",
    certifications: ["FRC Mobility Specialist", "NASM Corrective Exercise Specialist", "RYT-200"],
    quote: "Mobility is strength you can access when the position gets difficult.",
    instagram: "@elena.moves"
  }
];

export const classes: GymClass[] = [
  { id: "c1", name: "Barbell Fundamentals", day: "Monday", start: "06:00", end: "07:00", trainer: "Maya Stone", trainerSlug: "maya-stone", intensity: 2, type: "Strength", spotsLeft: 3 },
  { id: "c2", name: "Engine Room", day: "Monday", start: "18:00", end: "18:45", trainer: "Marcus Reed", trainerSlug: "marcus-reed", intensity: 3, type: "Conditioning", spotsLeft: 8 },
  { id: "c3", name: "Strength 01", day: "Tuesday", start: "07:00", end: "08:00", trainer: "Maya Stone", trainerSlug: "maya-stone", intensity: 3, type: "Strength", spotsLeft: 4 },
  { id: "c4", name: "Reset", day: "Tuesday", start: "17:30", end: "18:15", trainer: "Elena Park", trainerSlug: "elena-park", intensity: 1, type: "Mobility", spotsLeft: 10 },
  { id: "c5", name: "Hybrid 60", day: "Wednesday", start: "06:00", end: "07:00", trainer: "Marcus Reed", trainerSlug: "marcus-reed", intensity: 3, type: "Hybrid", spotsLeft: 2 },
  { id: "c6", name: "Open Barbell", day: "Wednesday", start: "19:00", end: "20:00", trainer: "Maya Stone", trainerSlug: "maya-stone", intensity: 2, type: "Strength", spotsLeft: 12 },
  { id: "c7", name: "Aerobic Base", day: "Thursday", start: "07:00", end: "07:45", trainer: "Marcus Reed", trainerSlug: "marcus-reed", intensity: 2, type: "Conditioning", spotsLeft: 5 },
  { id: "c8", name: "Loaded Mobility", day: "Thursday", start: "18:00", end: "18:45", trainer: "Elena Park", trainerSlug: "elena-park", intensity: 2, type: "Mobility", spotsLeft: 6 },
  { id: "c9", name: "Heavy Friday", day: "Friday", start: "17:30", end: "18:45", trainer: "Maya Stone", trainerSlug: "maya-stone", intensity: 3, type: "Strength", spotsLeft: 1 },
  { id: "c10", name: "Saturday Combine", day: "Saturday", start: "09:00", end: "10:15", trainer: "Marcus Reed", trainerSlug: "marcus-reed", intensity: 3, type: "Hybrid", spotsLeft: 4 },
  { id: "c11", name: "Sunday Restore", day: "Sunday", start: "10:00", end: "11:00", trainer: "Elena Park", trainerSlug: "elena-park", intensity: 1, type: "Mobility", spotsLeft: 14 }
];

export const transformations = [
  {
    id: "t1",
    name: "Jordan K.",
    weeks: 16,
    goal: "Recomposition",
    quote: "The process stopped feeling random. Every week had a purpose.",
    before: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: "t2",
    name: "Sam R.",
    weeks: 12,
    goal: "Strength",
    quote: "My first two-plate squat was a line in the sand.",
    before: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=85",
    after: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: "t3",
    name: "Alex M.",
    weeks: 20,
    goal: "Athletic Performance",
    quote: "Faster, stronger, and finally durable through a full season.",
    before: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=85",
    after: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=85"
  }
];

export const stats = [
  { value: 500, suffix: "+", label: "Members trained" },
  { value: 12, suffix: "", label: "Years under load" },
  { value: 40, suffix: "+", label: "Classes each week" },
  { value: 4.9, suffix: "/5", label: "Member rating", decimals: 1 }
];

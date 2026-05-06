import type { Vehicle } from "./types";

// Seed vehicles used by both the in-memory demo store and the optional
// "seed Firestore" admin script.
export const SEED_VEHICLES: Omit<Vehicle, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Porsche 911 Carrera",
    category: "Sports Car",
    pricePerDay: 450,
    seats: 2,
    bags: 1,
    transmission: "Automatic",
    fuel: "Gasoline",
    description:
      "Iconic silhouette, blistering performance, and refined interior. The ultimate driving experience for the coastal highways.",
    features: "0-60 in 3.8s,Premium Sound,Sport Chrono,Heated Seats",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    featured: true,
    available: true,
  },
  {
    name: "Tesla Model S Plaid",
    category: "Electric",
    pricePerDay: 320,
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Electric",
    description:
      "Tri-motor all-wheel drive electric sedan with 1,020 horsepower and a 17-inch cinematic display.",
    features: "0-60 in 1.99s,Autopilot,Glass Roof,Premium Audio",
    imageUrl:
      "https://images.unsplash.com/photo-1617704548623-340376564e68?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Range Rover Autobiography",
    category: "Luxury SUV",
    pricePerDay: 380,
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    fuel: "Hybrid",
    description:
      "Effortless luxury with semi-aniline leather, rear executive class seats, and class-leading off-road capability.",
    features: "Massaging Seats,Meridian Audio,Pano Roof,Air Suspension",
    imageUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "BMW M4 Competition Convertible",
    category: "Convertible",
    pricePerDay: 290,
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    fuel: "Gasoline",
    description:
      "503-horsepower twin-turbo six with a retractable soft top — built for sun-soaked coastal cruising.",
    features: "0-60 in 3.6s,M Sport Brakes,Harman Kardon,Heated Steering",
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Rivian R1S",
    category: "Electric SUV",
    pricePerDay: 310,
    seats: 7,
    bags: 5,
    transmission: "Automatic",
    fuel: "Electric",
    description:
      "Three-row, all-electric adventure SUV with quad-motor torque vectoring and 316-mile range.",
    features: "AWD,Off-Road Mode,Glass Roof,Tow Mode",
    imageUrl:
      "https://images.unsplash.com/photo-1669228431771-c12c4ed64bb1?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Range Rover Velar",
    category: "Luxury SUV",
    pricePerDay: 285,
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    fuel: "Hybrid",
    description:
      "Sleek, minimalist design meets refined performance. The most road-focused Range Rover.",
    features: "Touch Pro Duo,Hybrid,Meridian Audio,Heated Seats",
    imageUrl:
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Mercedes-Benz S-Class",
    category: "Sedan",
    pricePerDay: 360,
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    fuel: "Gasoline",
    description:
      "The benchmark for luxury sedans. Burmester 4D audio, executive rear seats, and silken ride quality.",
    features: "Burmester 4D,Massaging Seats,HUD,Night Vision",
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    featured: false,
    available: true,
  },
];

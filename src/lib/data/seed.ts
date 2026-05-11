import type { Vehicle } from "./types";

// Seed vehicles used by both the in-memory demo store and the optional
// "seed Firestore" admin script.
export const SEED_VEHICLES: Omit<Vehicle, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Porsche 911 Carrera",
    description:
      "Iconic silhouette, blistering performance, and refined interior. The ultimate driving experience for the coastal highways.",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    featured: true,
    available: true,
  },
  {
    name: "Tesla Model S Plaid",
    description:
      "Tri-motor all-wheel drive electric sedan with 1,020 horsepower and a 17-inch cinematic display.",
    imageUrl:
      "https://images.unsplash.com/photo-1617704548623-340376564e68?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Range Rover Autobiography",
    description:
      "Effortless luxury with semi-aniline leather, rear executive class seats, and class-leading off-road capability.",
    imageUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "BMW M4 Competition Convertible",
    description:
      "503-horsepower twin-turbo six with a retractable soft top — built for sun-soaked coastal cruising.",
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Rivian R1S",
    description:
      "Three-row, all-electric adventure SUV with quad-motor torque vectoring and 316-mile range.",
    imageUrl:
      "https://images.unsplash.com/photo-1669228431771-c12c4ed64bb1?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Range Rover Velar",
    description:
      "Sleek, minimalist design meets refined performance. The most road-focused Range Rover.",
    imageUrl:
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=1200&q=80",
    featured: false,
    available: true,
  },
  {
    name: "Mercedes-Benz S-Class",
    description:
      "The benchmark for luxury sedans. Burmester 4D audio, executive rear seats, and silken ride quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    featured: false,
    available: true,
  },
];

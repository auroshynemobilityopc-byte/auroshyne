import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BRAND_COLORS = {
  primary: "#0D0F14",
  secondary: "#1A1F2B",
  blue: "#1E90FF",
  accent: "#00A3FF",
  textGrey: "#B0B8C5",
};

export const SERVICES = [
  {
    id: "water-wash",
    name: "Water Wash (Exterior)",
    description: "Pressure water wash + shampoo wash + dust/mud removal + drying.",
    benefit: "Best for quick wash and regular cleaning.",
    recommended: "Weekly cleaning",
    price: { twoWheeler: 149, fourWheeler: 399, cab: 399 },
  },
  {
    id: "foam-wash",
    name: "Foam Wash (Exterior Premium)",
    description: "Foam spray + rubbing + deep dirt cleaning + rinse + microfiber drying.",
    benefit: "Better shine and deep cleaning compared to normal wash.",
    recommended: "Premium look",
    price: { twoWheeler: 249, fourWheeler: 549, cab: 649 }, // Estimated/Interpolated based on range
  },
  {
    id: "interior-cleaning",
    name: "Interior Cleaning",
    description: "Vacuum seats + floor + mats + dashboard wipe + door pads cleaning + glass cleaning.",
    benefit: "Removes dust, smell, and gives hygienic interior.",
    recommended: "Monthly interior cleaning",
    price: { twoWheeler: 0, fourWheeler: 649, cab: 0 }, // Not applicable for 2W usually, but keeping structure
  },
  {
    id: "full-wash",
    name: "Full Wash (Exterior + Interior)",
    description: "Water wash + foam wash + interior vacuum + dashboard cleaning + final drying.",
    benefit: "Complete inside + outside cleaning with best value.",
    recommended: "Monthly full service",
    price: { twoWheeler: 399, fourWheeler: 799, cab: 949 },
  },
  {
    id: "premium-detailing",
    name: "Premium Detailing",
    description: "Deep cleaning (interior + exterior) + dashboard polish + tyre shining + finishing.",
    benefit: "Showroom finish and high premium look.",
    recommended: "Special occasions",
    price: { twoWheeler: 899, fourWheeler: 1799, cab: 2199 },
  },
];

export const ADDONS = [
  {
    id: "dashboard-cleaning",
    name: "Dashboard Cleaning",
    description: "Dashboard deep cleaning & shine",
    price: 199,
  },
  {
    id: "tyre-shining",
    name: "Tyre Shining",
    description: "Tyre polish & shine coating",
    price: 249,
  },
  {
    id: "wax-polish",
    name: "Wax Polish",
    description: "Body wax polish for premium shine",
    price: 599,
  },
  {
    id: "seat-shampoo",
    name: "Seat Shampoo Cleaning",
    description: "Deep seat cleaning & stain removal",
    price: 899,
  },
  {
    id: "engine-cleaning",
    name: "Engine Cleaning",
    description: "Safe engine bay cleaning",
    price: 699,
  },
  {
    id: "underbody-cleaning",
    name: "Underbody Cleaning",
    description: "Underbody deep wash",
    price: 699,
  },
];

export const SLOTS = [
  { id: "morning", label: "Morning", time: "08:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 04:00 PM" },
  { id: "evening", label: "Evening", time: "04:00 PM – 08:00 PM" },
];

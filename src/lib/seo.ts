export const SITE_URL = "https://go4task.com";
export const SITE_NAME = "Go4Task";
export const SITE_DESCRIPTION =
  "Book local home services with Go4Task. Request a plumber, electrician, carpenter, AC service, CCTV installer, Wi-Fi installer, cleaner and more, receive provider offers and choose the right professional.";

export type SeoService = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  jobs: string[];
};

export const SEO_SERVICES: SeoService[] = [
  {
    slug: "plumber",
    name: "Plumber",
    shortName: "Plumbing Services",
    description: "Find plumbing professionals for leaks, taps, pipes, drainage, bathroom fittings, water pressure and other home plumbing work.",
    jobs: ["Leak and pipe repair", "Tap and faucet repair", "Drain and blockage work", "Bathroom plumbing", "Water pressure issues"],
  },
  {
    slug: "electrician",
    name: "Electrician",
    shortName: "Electrical Services",
    description: "Book an electrician for switches, sockets, wiring, lights, fans, power faults and other residential electrical work.",
    jobs: ["Switch and socket repair", "Fan and light installation", "Wiring and rewiring", "Power fault checks", "Home electrical maintenance"],
  },
  {
    slug: "carpenter",
    name: "Carpenter",
    shortName: "Carpentry Services",
    description: "Connect with carpenters for furniture repairs, doors, cabinets, shelves, fittings and custom woodwork at home.",
    jobs: ["Furniture repair", "Door and lock fitting", "Cabinet work", "Shelf installation", "Custom woodwork"],
  },
  {
    slug: "ac-repair",
    name: "AC Repair",
    shortName: "AC Repair Services",
    description: "Request AC repair for cooling problems, unusual noise, water leakage, electrical faults and other air-conditioner issues.",
    jobs: ["AC not cooling", "AC water leakage", "Noise and vibration checks", "Electrical fault checks", "AC performance issues"],
  },
  {
    slug: "ac-service",
    name: "AC Service",
    shortName: "AC Service & Maintenance",
    description: "Book AC servicing and maintenance to help keep your air conditioner clean, efficient and ready for regular use.",
    jobs: ["AC cleaning", "Filter cleaning", "General maintenance", "Cooling performance checks", "Seasonal AC service"],
  },
  {
    slug: "cctv-installation",
    name: "CCTV Installation",
    shortName: "CCTV Installation Services",
    description: "Find professionals for residential CCTV camera installation, setup, positioning, wiring and basic system configuration.",
    jobs: ["Camera installation", "CCTV wiring", "Camera positioning", "DVR/NVR setup", "Basic system configuration"],
  },
  {
    slug: "wifi-installation",
    name: "Wi-Fi Installation",
    shortName: "Wi-Fi Installation Services",
    description: "Book Wi-Fi installation and home network setup for routers, access points, coverage improvements and connected devices.",
    jobs: ["Router installation", "Wi-Fi setup", "Coverage improvement", "Access point setup", "Home network configuration"],
  },
  {
    slug: "home-cleaning",
    name: "Home Cleaning",
    shortName: "Home Cleaning Services",
    description: "Request home cleaning help for regular cleaning, deep cleaning, kitchens, bathrooms, rooms and common household areas.",
    jobs: ["Deep home cleaning", "Kitchen cleaning", "Bathroom cleaning", "Room cleaning", "Regular household cleaning"],
  },
  {
    slug: "painter",
    name: "Painter",
    shortName: "Painting Services",
    description: "Find painters for interior and exterior home painting, touch-ups, wall preparation and related residential painting work.",
    jobs: ["Interior painting", "Exterior painting", "Wall touch-ups", "Surface preparation", "Room repainting"],
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    shortName: "Pest Control Services",
    description: "Connect with pest-control professionals for common household pest problems and preventive treatment options.",
    jobs: ["General pest control", "Cockroach treatment", "Ant treatment", "Mosquito control", "Preventive pest treatment"],
  },
  {
    slug: "washing-machine-repair",
    name: "Washing Machine Repair",
    shortName: "Washing Machine Repair",
    description: "Request washing machine repair for common appliance faults, drainage problems, unusual noise and operating issues.",
    jobs: ["Machine not starting", "Drainage issues", "Spin-cycle problems", "Unusual noise", "General appliance diagnosis"],
  },
  {
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    shortName: "Refrigerator Repair",
    description: "Find refrigerator repair professionals for cooling issues, unusual noise, water leakage and other appliance problems.",
    jobs: ["Cooling problems", "Water leakage", "Unusual noise", "Temperature issues", "General refrigerator diagnosis"],
  },
  {
    slug: "tv-repair",
    name: "TV Repair",
    shortName: "TV Repair Services",
    description: "Book a TV repair professional for common television display, sound, power and connectivity problems.",
    jobs: ["TV not turning on", "Display problems", "Sound issues", "Connectivity issues", "General TV diagnosis"],
  },
  {
    slug: "geyser-repair",
    name: "Geyser Repair",
    shortName: "Geyser Repair Services",
    description: "Request geyser repair and maintenance for heating, leakage, thermostat and other common water-heater issues.",
    jobs: ["Geyser not heating", "Water leakage", "Thermostat issues", "Electrical checks", "General geyser maintenance"],
  },
  {
    slug: "ro-service",
    name: "RO Service",
    shortName: "RO Water Purifier Service",
    description: "Find professionals for RO water purifier servicing, filter replacement, cleaning, leakage checks and maintenance.",
    jobs: ["RO servicing", "Filter replacement", "Purifier cleaning", "Leakage checks", "Water purifier maintenance"],
  },
  {
    slug: "sofa-cleaning",
    name: "Sofa Cleaning",
    shortName: "Sofa Cleaning Services",
    description: "Book sofa and upholstery cleaning for household seating, stains, dust and routine fabric-care needs.",
    jobs: ["Sofa deep cleaning", "Fabric cleaning", "Stain treatment", "Dust removal", "Upholstery care"],
  },
  {
    slug: "bathroom-cleaning",
    name: "Bathroom Cleaning",
    shortName: "Bathroom Cleaning Services",
    description: "Request professional bathroom cleaning for tiles, fixtures, floors, fittings and routine deep-cleaning needs.",
    jobs: ["Bathroom deep cleaning", "Tile cleaning", "Fixture cleaning", "Floor cleaning", "Bathroom maintenance cleaning"],
  },
  {
    slug: "kitchen-cleaning",
    name: "Kitchen Cleaning",
    shortName: "Kitchen Cleaning Services",
    description: "Find cleaning professionals for kitchen surfaces, cabinets, floors, appliances and deeper household kitchen cleaning.",
    jobs: ["Kitchen deep cleaning", "Cabinet cleaning", "Surface cleaning", "Appliance-area cleaning", "Kitchen floor cleaning"],
  },
  {
    slug: "locksmith",
    name: "Locksmith",
    shortName: "Locksmith Services",
    description: "Request locksmith help for home lock repair, replacement, installation and other residential access needs.",
    jobs: ["Lock repair", "Lock replacement", "Door lock installation", "Key-related assistance", "Home access support"],
  },
  {
    slug: "false-ceiling",
    name: "False Ceiling",
    shortName: "False Ceiling Services",
    description: "Connect with professionals for false-ceiling installation, repairs, finishing and related residential ceiling work.",
    jobs: ["Ceiling installation", "Ceiling repair", "Lighting cut-outs", "Finishing work", "Residential ceiling maintenance"],
  },
  {
    slug: "water-tank-cleaning",
    name: "Water Tank Cleaning",
    shortName: "Water Tank Cleaning Services",
    description: "Book water-tank cleaning for residential overhead and underground tanks, subject to local provider availability.",
    jobs: ["Overhead tank cleaning", "Underground tank cleaning", "Tank inspection", "Sediment removal", "Routine tank maintenance"],
  },
  {
    slug: "mason",
    name: "Mason",
    shortName: "Masonry Services",
    description: "Find masonry professionals for small home construction, repair, plastering and other residential building work.",
    jobs: ["Wall repair", "Plastering", "Brickwork", "Minor construction", "Masonry maintenance"],
  },
  {
    slug: "tile-work",
    name: "Tile Work",
    shortName: "Tile Installation & Repair",
    description: "Request tile professionals for floor and wall tile installation, replacement, repair and finishing work.",
    jobs: ["Floor tile installation", "Wall tile installation", "Broken tile replacement", "Grouting", "Tile repair"],
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    shortName: "Deep Cleaning Services",
    description: "Book a deeper residential cleaning service for rooms, kitchens, bathrooms and other household areas.",
    jobs: ["Full-home deep cleaning", "Kitchen deep cleaning", "Bathroom deep cleaning", "Room-by-room cleaning", "Move-in cleaning"],
  },
  {
    slug: "interior-design",
    name: "Interior Design",
    shortName: "Interior Design Services",
    description: "Connect with interior professionals for residential planning, space improvement, styling and project guidance.",
    jobs: ["Room planning", "Space planning", "Home styling", "Furniture layout", "Interior consultation"],
  },
  {
    slug: "home-appliance-repair",
    name: "Home Appliance Repair",
    shortName: "Home Appliance Repair",
    description: "Request appliance repair for common household equipment and get connected with eligible professionals.",
    jobs: ["Appliance diagnosis", "Electrical appliance issues", "Home appliance maintenance", "Part-related checks", "General repair support"],
  },
  {
    slug: "computer-repair",
    name: "Computer Repair",
    shortName: "Computer Repair Services",
    description: "Find professionals for home computer troubleshooting, setup, hardware checks, software assistance and maintenance.",
    jobs: ["Computer troubleshooting", "Hardware checks", "Software setup", "Wi-Fi and network setup", "Computer maintenance"],
  },
  {
    slug: "home-networking",
    name: "Home Networking",
    shortName: "Home Network Services",
    description: "Book home networking help for routers, connected devices, network coverage and basic residential network setup.",
    jobs: ["Home network setup", "Router configuration", "Device connectivity", "Network coverage", "Basic troubleshooting"],
  },
  {
    slug: "movers-packers",
    name: "Movers & Packers",
    shortName: "Movers & Packers Services",
    description: "Find eligible movers and packers for household shifting, packing assistance and local moving requirements.",
    jobs: ["Home shifting", "Packing assistance", "Loading and unloading", "Local moves", "Household relocation support"],
  },
  {
    slug: "gardener",
    name: "Gardener",
    shortName: "Gardening Services",
    description: "Request gardening help for home plants, trimming, maintenance, basic landscaping and routine garden care.",
    jobs: ["Garden maintenance", "Plant care", "Trimming", "Basic landscaping", "Home garden cleanup"],
  },
  {
    slug: "security-system-installation",
    name: "Security System Installation",
    shortName: "Security System Services",
    description: "Connect with professionals for residential security-device installation, setup and basic system configuration.",
    jobs: ["Security device installation", "System setup", "Wiring", "Device positioning", "Basic configuration"],
  },
];

export const SEO_FAQS = [
  {
    q: "How can I book a plumber, electrician or other home service near me?",
    a: "Choose the service you need in Go4Task, add your job details and submit the request. Eligible nearby providers can receive the request and send offers. You can compare available offers and choose the provider that suits your requirements.",
  },
  {
    q: "Can I compare multiple providers before booking?",
    a: "Yes. Go4Task is designed around a request-and-offer marketplace. Multiple eligible providers may send offers, allowing you to review the available information before selecting a provider.",
  },
  {
    q: "Is Go4Task free for customers?",
    a: "Go4Task does not charge customers a subscription to use the marketplace. Any applicable booking, service or payment terms are shown through the app and applicable policies.",
  },
  {
    q: "Are Go4Task providers verified?",
    a: "Providers are required to complete the applicable KYC and verification process before they can send eligible offers. Verification supports identity and platform eligibility checks but does not guarantee workmanship or service outcomes.",
  },
  {
    q: "What home services can I find on Go4Task?",
    a: "The service catalogue can include plumbing, electrical work, carpentry, AC repair and service, painting, cleaning, CCTV installation, Wi-Fi installation, appliance repair, pest control and other categories. Availability depends on the current catalogue and providers in your area.",
  },
  {
    q: "How does Go4Task find nearby providers?",
    a: "A service request can be made available to eligible providers based on the requested service, location and other platform criteria. Provider availability can vary by area and time.",
  },
  {
    q: "Can I join Go4Task as a service provider?",
    a: "Yes. Providers can create a provider account, choose eligible service categories, complete the required KYC and verification steps, and respond to relevant customer requests when eligible.",
  },
  {
    q: "Is Go4Task available for every service and every location?",
    a: "Coverage depends on the live service catalogue and active provider availability. Go4Task can expand services and locations over time, so the app is the best place to check current availability for your area.",
  },
];

export function getServiceBySlug(slug: string | undefined) {
  const normalized = String(slug ?? "").trim().toLowerCase();
  return SEO_SERVICES.find((service) => service.slug === normalized);
}

export function humanizeServiceSlug(slug: string) {
  return String(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

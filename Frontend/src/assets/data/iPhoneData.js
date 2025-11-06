import iphone17porange from "../iphones/iphone17porange.png";
import iphone16ultramarine from "../iphones/iphone16ultramarine.png";
import iphone15black from "../iphones/iphone15black.png";
import iphone14midnight from "../iphones/iphone14midnight.png";
import iphone13blue from "../iphones/iphone13blue.png";
import iphone12black from "../iphones/iphone12black.png";
import iphone11white from "../iphones/iphone11white.png";
import iphoneXRblue from "../iphones/iphoneXRblue.png";

let iPhoneData = [
  {
    id: "iphone17pro",
    category: "iphone",
    image: iphone17porange,
    name: "iPhone 17 Pro - 256GB",
    oldPrice: "70,999",
    newPrice: "60,499",
    variants: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      "Natural Titanium",
      "Blue Titanium",
      "White Titanium",
      "Black Titanium",
    ],
    description:
      "The most advanced iPhone Pro ever. Featuring the powerful A19 Pro chip, enhanced camera system with 5x optical zoom, and stunning titanium design for ultimate durability and style.",
  },
  {
    id: "iphone16ultramarine",
    category: "iphone",
    image: iphone16ultramarine,
    name: "iPhone 16 - Ultramarine 256GB",
    oldPrice: "55,999",
    newPrice: "50,499",
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    description:
      "All-new iPhone 16 with A18 chip delivers exceptional performance. Features advanced dual-camera system, Action button, and stunning Ultramarine color that stands out.",
  },
  {
    id: "iphone15black",
    category: "iphone",
    image: iphone15black,
    name: "iPhone 15 - Black 128GB",
    oldPrice: "45,999",
    newPrice: "40,499",
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    description:
      "iPhone 15 brings Dynamic Island to the standard model. Powered by A16 Bionic chip with improved camera capabilities and USB-C charging for seamless connectivity.",
  },
  {
    id: "iphone14midnight",
    category: "iphone",
    image: iphone14midnight,
    name: "iPhone 14 - Midnight 128GB",
    oldPrice: "45,999",
    newPrice: "31,499",
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Midnight", "Purple", "Starlight", "Blue", "Red"],
    description:
      "iPhone 14 features A15 Bionic chip, advanced camera system with Photonic Engine, and Emergency SOS via satellite. Perfect balance of performance and value.",
  },
  {
    id: "iphone13blue",
    category: "iphone",
    image: iphone13blue,
    name: "iPhone 13 - Blue 128GB",
    oldPrice: "25,999",
    newPrice: "20,459",
    variants: ["128GB", "256GB", "512GB"],
    colors: ["Blue", "Pink", "Midnight", "Starlight", "Red", "Green"],
    description:
      "Reliable iPhone 13 with A15 Bionic chip offers excellent performance. Features dual-camera system with Cinematic mode and all-day battery life for everyday use.",
  },
  {
    id: "iphone12black",
    category: "iphone",
    image: iphone12black,
    name: "iPhone 12 - Black 128GB",
    oldPrice: "18,999",
    newPrice: "14,499",
    variants: ["64GB", "128GB", "256GB"],
    colors: ["Black", "White", "Red", "Green", "Blue", "Purple"],
    description:
      "First iPhone with 5G capability. Powered by A14 Bionic chip with dual-camera system and beautiful edge-to-edge OLED display in sleek Black finish.",
  },
  {
    id: "iphone11white",
    category: "iphone",
    image: iphone11white,
    name: "iPhone 11 - White 128GB",
    oldPrice: "14,999",
    newPrice: "11,499",
    variants: ["64GB", "128GB", "256GB"],
    colors: ["White", "Black", "Yellow", "Purple", "Red", "Green"],
    description:
      "Budget-friendly iPhone 11 with A13 Bionic chip. Features dual-camera system with Night mode and impressive battery life, perfect for first-time iPhone users.",
  },
  {
    id: "iphonexrblue",
    category: "iphone",
    image: iphoneXRblue,
    name: "iPhone XR - Blue 64GB",
    oldPrice: "11,999",
    newPrice: "9,499",
    variants: ["64GB", "128GB"],
    colors: ["Blue", "White", "Black", "Yellow", "Coral", "Red"],
    description:
      "Affordable iPhone XR offers great value with A12 Bionic chip. Features Liquid Retina display and excellent single-camera system in vibrant Blue color.",
  },
];

export default iPhoneData;

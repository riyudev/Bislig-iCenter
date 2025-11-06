import iphone11white from "../iphones/iphone11white.png";
import macbookair from "../laptops/mcbkair.png";
import ipadpro from "../ipads/ipadpro.png";

export const bestSeller = [
  {
    id: "iphone11",
    category: "iphone",
    image: iphone11white,
    name: "iPhone 11",
    newPrice: "11,499",
    oldPrice: "14,999",
    variants: ["64GB", "128GB", "256GB"],
    colors: ["White", "Black", "Purple", "Red", "Green", "Yellow"],
    description:
      "The iPhone 11 offers powerful performance with the A13 Bionic chip, dual-camera system, and all-day battery life — a great balance of features and value.",
  },
  {
    id: "ipadpro",
    category: "ipad",
    image: ipadpro,
    name: "iPad Pro",
    newPrice: "20,499",
    oldPrice: "25,999",
    variants: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    colors: ["Silver", "Space Gray"],
    description:
      "The iPad Pro combines power and portability with its M3 chip, ProMotion display, and long battery life — perfect for productivity and creativity anywhere.",
  },
  {
    id: "macbookair",
    category: "laptop",
    image: macbookair,
    name: "MacBook Air M2",
    newPrice: "55,999",
    oldPrice: "70,599",
    variants: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    description:
      "Lightweight yet powerful, the MacBook Air M2 features next-generation performance, a brilliant Retina display, and exceptional battery life for everyday use.",
  },
];

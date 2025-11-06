import iphone17 from "../iphones/iphone17porange.png";
import ipadpro from "../hero/ipadpro.png";
import macbookair from "../hero/mcbkair.png";
import samsungs25ultra from "../hero/samsungs25ultra.png";

export const latestItem = [
  {
    id: "iphone17pro",
    category: "iphone",
    image: iphone17,
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
    id: "ipadpro",
    category: "tablet",
    image: ipadpro,
    name: "iPad Pro - 64GB",
    newPrice: "20,499",
    oldPrice: "25,999",
    variants: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    colors: ["Silver", "Space Gray"],
    description:
      "The iPad Pro delivers laptop-level performance in a sleek, ultra-thin design. Powered by the M3 chip, it’s perfect for productivity, creativity, and entertainment on the go.",
  },
  {
    id: "macbookair",
    category: "laptop",
    image: macbookair,
    name: "MacBook Air M2 - 256GB",
    newPrice: "55,999",
    oldPrice: "70,599",
    variants: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    description:
      "The MacBook Air with M2 redefines thin and powerful. Experience blazing-fast performance, a Liquid Retina display, and all-day battery life in a stunning aluminum body.",
  },
  {
    id: "samsungs25ultra",
    category: "android",
    image: samsungs25ultra,
    name: "Samsung Galaxy S25 Ultra - 128GB",
    newPrice: "70,499",
    oldPrice: "80,999",
    variants: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Titanium Gray", "Phantom Black", "Cobalt Violet", "Mint Green"],
    description:
      "The Galaxy S25 Ultra combines cutting-edge design and performance with a stunning AMOLED 2X display, Snapdragon Gen 4 processor, and a 200MP quad camera for professional-level photography.",
  },
];

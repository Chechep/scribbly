const loremIpsum = (wordCount) => {
    const words = "Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur".split(" ");
    let text = [];
    for (let i = 0; i < wordCount; i++) {
      text.push(words[i % words.length]);
    }
    return text.join(" ") + ".";
  };
  
  // Define categories
  const categories = ["Lifestyle", "Sports", "Gossip", "Tech", "Travel", "Health", "Education"];
  
  // Map category to 6 picsum images each (seeded for variety)
  const categoryImages = {
    Lifestyle: [
      "https://picsum.photos/seed/lifestyle1/600/400",
      "https://picsum.photos/seed/lifestyle2/600/400",
      "https://picsum.photos/seed/lifestyle3/600/400",
      "https://picsum.photos/seed/lifestyle4/600/400",
      "https://picsum.photos/seed/lifestyle5/600/400",
      "https://picsum.photos/seed/lifestyle6/600/400"
    ],
    Sports: [
      "https://picsum.photos/seed/sports1/600/400",
      "https://picsum.photos/seed/sports2/600/400",
      "https://picsum.photos/seed/sports3/600/400",
      "https://picsum.photos/seed/sports4/600/400",
      "https://picsum.photos/seed/sports5/600/400",
      "https://picsum.photos/seed/sports6/600/400"
    ],
    Gossip: [
      "https://picsum.photos/seed/gossip1/600/400",
      "https://picsum.photos/seed/gossip2/600/400",
      "https://picsum.photos/seed/gossip3/600/400",
      "https://picsum.photos/seed/gossip4/600/400",
      "https://picsum.photos/seed/gossip5/600/400",
      "https://picsum.photos/seed/gossip6/600/400"
    ],
    Tech: [
      "https://picsum.photos/seed/tech1/600/400",
      "https://picsum.photos/seed/tech2/600/400",
      "https://picsum.photos/seed/tech3/600/400",
      "https://picsum.photos/seed/tech4/600/400",
      "https://picsum.photos/seed/tech5/600/400",
      "https://picsum.photos/seed/tech6/600/400"
    ],
    Travel: [
      "https://picsum.photos/seed/travel1/600/400",
      "https://picsum.photos/seed/travel2/600/400",
      "https://picsum.photos/seed/travel3/600/400",
      "https://picsum.photos/seed/travel4/600/400",
      "https://picsum.photos/seed/travel5/600/400",
      "https://picsum.photos/seed/travel6/600/400"
    ],
    Health: [
      "https://picsum.photos/seed/health1/600/400",
      "https://picsum.photos/seed/health2/600/400",
      "https://picsum.photos/seed/health3/600/400",
      "https://picsum.photos/seed/health4/600/400",
      "https://picsum.photos/seed/health5/600/400",
      "https://picsum.photos/seed/health6/600/400"
    ],
    Education: [
      "https://picsum.photos/seed/education1/600/400",
      "https://picsum.photos/seed/education2/600/400",
      "https://picsum.photos/seed/education3/600/400",
      "https://picsum.photos/seed/education4/600/400",
      "https://picsum.photos/seed/education5/600/400",
      "https://picsum.photos/seed/education6/600/400"
    ],
  };
  
  // Example posts
  const posts = [
    {
      id: "1",
      title: "The Dawn of Storytelling",
      excerpt: "Exploring how stories shaped humanity’s earliest connections.",
      content: loremIpsum(120),
      date: "Sep 1, 2025",
      comments: 12,
      likes: 45,
      category: "Lifestyle",
      image: categoryImages["Lifestyle"][0],
    },
    {
      id: "2",
      title: "Writers of Tomorrow",
      excerpt: "How young creators are redefining storytelling in the digital age.",
      content: loremIpsum(150),
      date: "Sep 2, 2025",
      comments: 8,
      likes: 30,
      category: "Tech",
      image: categoryImages["Tech"][2],
    },
    {
      id: "3",
      title: "Echoes of the Past",
      excerpt: "Historical tales that continue to inspire modern voices.",
      content: loremIpsum(100),
      date: "Sep 3, 2025",
      comments: 6,
      likes: 22,
      category: "Education",
      image: categoryImages["Education"][1],
    },
  ];
  
  // Generate more posts programmatically
  for (let i = 4; i <= 30; i++) {
    const category = categories[i % categories.length];
    const images = categoryImages[category];
    const randomImage = images[Math.floor(Math.random() * images.length)];
  
    posts.push({
      id: String(i),
      title: `Sample Post ${i}`,
      excerpt: `This is a preview excerpt for sample post number ${i}.`,
      content: loremIpsum(120 + (i % 50)),
      date: `Sep ${i}, 2025`,
      comments: Math.floor(Math.random() * 20),
      likes: Math.floor(Math.random() * 100),
      category,
      image: randomImage,
    });
  }
  
  export default posts;
  export { categories };
  
// src/data/posts.js
const loremIpsum = (wordCount) => {
    const words = "Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur".split(" ");
    
    let text = [];
    for (let i = 0; i < wordCount; i++) {
      text.push(words[i % words.length]);
    }
    return text.join(" ") + ".";
  };
  
  const posts = [
    {
      id: "1",
      title: "The Dawn of Storytelling",
      excerpt: "Exploring how stories shaped humanity’s earliest connections.",
      content: loremIpsum(120), // full blog with ~120 words
      date: "Sep 1, 2025",
      comments: 12,
      likes: 45,
      image: "https://picsum.photos/seed/story/600/400",
    },
    {
      id: "2",
      title: "Writers of Tomorrow",
      excerpt: "How young creators are redefining storytelling in the digital age.",
      content: loremIpsum(150),
      date: "Sep 2, 2025",
      comments: 8,
      likes: 30,
      image: "https://picsum.photos/seed/writing/600/400",
    },
    {
      id: "3",
      title: "Echoes of the Past",
      excerpt: "Historical tales that continue to inspire modern voices.",
      content: loremIpsum(100),
      date: "Sep 3, 2025",
      comments: 6,
      likes: 22,
      image: "https://picsum.photos/seed/history/600/400",
    },
  ];
  
  // Generate more posts programmatically
  for (let i = 4; i <= 30; i++) {
    posts.push({
      id: String(i),
      title: `Sample Post ${i}`,
      excerpt: `This is a preview excerpt for sample post number ${i}.`,
      content: loremIpsum(120 + (i % 50)), // random length
      date: `Sep ${i}, 2025`,
      comments: Math.floor(Math.random() * 20),
      likes: Math.floor(Math.random() * 100),
      image: `https://picsum.photos/seed/${i}/600/400`,
    });
  }
  
  export default posts;
  
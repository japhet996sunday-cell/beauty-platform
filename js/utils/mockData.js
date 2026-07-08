const AVATAR_POOL = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=80",
  "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?w=200&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80",
];

const POST_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=700&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80",
  "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=700&q=80",
  "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=700&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&q=80",
  "https://images.unsplash.com/photo-1512207736890-6ffed4b6ad57?w=700&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80",
  "https://images.unsplash.com/photo-1570172619644-9df1e7c0d43d?w=700&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80",
];

const NAMES = [
  ["Amara Okafor", "amaraglows"], ["Priya Kapoor", "priyaskin"], ["Jonas Reyes", "jonasrituals"],
  ["Sofia Marin", "sofia.rituals"], ["Wren Ashby", "wrenwears"], ["Talia Nkomo", "taliaglow"],
  ["Diego Santos", "diegoskinlab"], ["Yuna Park", "yunabeauty"], ["Layla Hassan", "laylaskincare"],
  ["Milo Chen", "milocare"],
];

const HASHTAG_POOL = ["#skincare", "#glowup", "#skinbarrier", "#makeuplook", "#nightroutine", "#cleanbeauty", "#retinol", "#sunscreen", "#selfcare", "#beautytips"];

const CAPTION_POOL = [
  "Three weeks into this routine and my barrier finally feels calm again.",
  "The one product I regret not trying sooner. Full breakdown in comments.",
  "Soft glam for a Tuesday because why not.",
  "Rebuilding my routine from scratch — starting with the basics.",
  "This combination changed how my skin holds moisture overnight.",
  "Testing the viral serum so you don't have to guess.",
  "Simple five-step morning routine that actually fits before coffee.",
  "My skin texture six months after cutting out fragrance.",
];

function pick(pool, index) {
  return pool[index % pool.length];
}

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function generateUser(index) {
  const [name, handle] = pick(NAMES, index);
  return {
    id: `user-${index}`,
    name,
    handle,
    avatar: pick(AVATAR_POOL, index),
    verified: index % 4 === 0,
    followers: 800 + ((index * 137) % 42000),
    following: 120 + ((index * 53) % 900),
    posts: 20 + ((index * 17) % 300),
    bio: "Skincare enthusiast sharing what actually works, one routine at a time.",
    isFollowing: index % 3 === 0,
  };
}

export function generatePost(index) {
  const random = seededRandom(index + 1);
  const user = generateUser(index % NAMES.length);
  const imageCount = 1 + Math.floor(random() * 3);
  const images = Array.from({ length: imageCount }, (_, i) => pick(POST_IMAGE_POOL, index + i));
  const tags = Array.from({ length: 2 + Math.floor(random() * 2) }, (_, i) => pick(HASHTAG_POOL, index + i * 3));
  const hoursAgo = Math.floor(random() * 72) + 1;

  return {
    id: `post-${index}`,
    user,
    images,
    caption: pick(CAPTION_POOL, index),
    tags: [...new Set(tags)],
    likes: Math.floor(random() * 12000) + 40,
    comments: Math.floor(random() * 400) + 2,
    shares: Math.floor(random() * 150),
    timestamp: hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
    isLiked: random() > 0.7,
    isBookmarked: random() > 0.85,
    topComment: {
      user: pick(NAMES, index + 1)[0],
      text: "This is exactly what my skin needed to see today, thank you for sharing!",
    },
  };
}

export function generatePostBatch(startIndex, count) {
  return Array.from({ length: count }, (_, i) => generatePost(startIndex + i));
}

export function generateStories(count = 12) {
  return Array.from({ length: count }, (_, index) => ({
    id: `story-${index}`,
    user: generateUser(index),
    viewed: index > 0 && index % 3 === 0,
    isOwn: index === 0,
  }));
}

export function generateDiscoverUsers(count = 12) {
  return Array.from({ length: count }, (_, index) => generateUser(index + 20));
}


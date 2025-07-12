const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Mock data storage (in production, this would be a database)
let users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "$2a$10$hashedpassword",
    location: "New York, NY",
    skillsOffered: ["Web Development", "Graphic Design", "Photography"],
    skillsWanted: ["Cooking", "Spanish", "Yoga"],
    availability: "Weekends",
    profile: "public",
    rating: 4.8,
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    password: "$2a$10$hashedpassword",
    location: "San Francisco, CA",
    skillsOffered: ["Cooking", "Guitar", "Mandarin"],
    skillsWanted: ["Web Development", "Photography", "Fitness Training"],
    availability: "Evenings",
    profile: "public",
    rating: 4.6,
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    password: "$2a$10$hashedpassword",
    location: "Austin, TX",
    skillsOffered: ["Yoga", "Spanish", "Fitness Training"],
    skillsWanted: ["Graphic Design", "Guitar", "Cooking"],
    availability: "Weekdays",
    profile: "public",
    rating: 4.9,
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

let swaps = [
  {
    id: 1,
    fromUserId: 2,
    toUserId: 1,
    fromSkill: "Cooking",
    toSkill: "Web Development",
    message: "I'd love to learn web development! I can teach you some amazing recipes.",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    fromUserId: 3,
    toUserId: 1,
    fromSkill: "Yoga",
    toSkill: "Graphic Design",
    message: "Looking to improve my design skills. Happy to teach yoga in return!",
    status: "accepted",
    createdAt: new Date().toISOString()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // In a real app, you'd verify the JWT token here
  // For now, we'll just check if the user exists
  const userId = parseInt(req.headers['user-id']);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  req.user = user;
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Skill Swap API is running!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, location, profilePhoto } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  let finalProfilePhoto = profilePhoto;
  if (!finalProfilePhoto || typeof finalProfilePhoto !== 'string' || finalProfilePhoto.trim() === '') {
    finalProfilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff&size=150`;
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: `$2a$10$${password}`,
    location,
    skillsOffered: [],
    skillsWanted: [],
    availability: '',
    profile: 'public',
    rating: 0,
    profilePhoto: finalProfilePhoto
  };

  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, message: 'User registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || user.password !== `$2a$10$${password}`) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, message: 'Login successful' });
});

// User routes
app.get('/api/users', (req, res) => {
  const publicUsers = users.filter(u => u.profile === 'public').map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
  res.json(publicUsers);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { name, location, skillsOffered, skillsWanted, availability, profile, profilePhoto } = req.body;
  
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    location: location || users[userIndex].location,
    skillsOffered: skillsOffered || users[userIndex].skillsOffered,
    skillsWanted: skillsWanted || users[userIndex].skillsWanted,
    availability: availability || users[userIndex].availability,
    profile: profile || users[userIndex].profile,
    profilePhoto: profilePhoto || users[userIndex].profilePhoto
  };

  const { password, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

// Swap routes
app.get('/api/swaps', authenticateToken, (req, res) => {
  const userSwaps = swaps.filter(s => s.fromUserId === req.user.id || s.toUserId === req.user.id);
  res.json(userSwaps);
});

app.post('/api/swaps', authenticateToken, (req, res) => {
  const { toUserId, fromSkill, toSkill, message } = req.body;
  
  const newSwap = {
    id: swaps.length + 1,
    fromUserId: req.user.id,
    toUserId: parseInt(toUserId),
    fromSkill,
    toSkill,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  swaps.push(newSwap);
  res.status(201).json(newSwap);
});

app.put('/api/swaps/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const swapIndex = swaps.findIndex(s => s.id === parseInt(req.params.id));
  
  if (swapIndex === -1) {
    return res.status(404).json({ message: 'Swap not found' });
  }

  if (swaps[swapIndex].toUserId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  swaps[swapIndex].status = status;
  res.json(swaps[swapIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
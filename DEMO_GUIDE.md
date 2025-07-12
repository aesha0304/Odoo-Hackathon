# 🚀 Skill Swap Platform - Demo Guide

## ✅ Current Status
- **Backend Server**: Running on http://localhost:3001 ✅
- **Frontend Server**: Running on http://localhost:5173 ✅
- **API Health Check**: ✅ Working

## 🌐 Access the Application
Open your browser and go to: **http://localhost:5173**

## 🎯 Demo Testing Scenarios

### 1. **Home Page Exploration**
- Visit the home page
- See the list of pre-populated users (Sarah, Mike, Emma)
- Test the search functionality (try searching for "Web Development" or "Cooking")
- Test the availability filter (Weekends, Weekdays, etc.)
- Click on user cards to view profiles

### 2. **User Registration**
- Click "Login" in the navbar
- Click "Sign up here" link
- Fill out the registration form:
  - Name: "Demo User"
  - Email: "demo@example.com"
  - Location: "San Francisco, CA"
  - Password: "demo123"
  - Confirm Password: "demo123"
- Submit the form
- You should be automatically logged in and redirected to home

### 3. **Profile Setup**
- Click "Profile" in the navbar
- Click "Edit Profile" button
- Add some skills you can offer:
  - Click "+" next to "Skills I Can Offer"
  - Add: "JavaScript", "React", "Cooking"
- Add some skills you want to learn:
  - Click "+" next to "Skills I Want to Learn"
  - Add: "Photography", "Guitar", "Spanish"
- Set availability to "Weekends"
- Click "Save Changes"

### 4. **Browse and View Profiles**
- Go back to Home page
- You should now see your profile in the list
- Click on other users' profiles (Sarah, Mike, Emma)
- View their skills, ratings, and availability
- Notice the "Request Skill Swap" button

### 5. **Send a Swap Request**
- Click on Sarah's profile
- Click "Request Skill Swap"
- Fill out the request form:
  - "I can teach you": Select "JavaScript" (from your skills)
  - "I want to learn": Select "Photography" (from Sarah's skills)
  - Message: "Hi Sarah! I'd love to learn photography from you. I can teach you JavaScript in return!"
- Click "Send Request"

### 6. **Manage Swap Requests**
- Click "Swap Requests" in the navbar
- You should see your outgoing request to Sarah
- Switch between tabs: "Pending", "Accepted", "Rejected", "Incoming", "Outgoing"
- Notice the request status is "pending"

### 7. **Test as Another User (Optional)**
- Open a new incognito/private browser window
- Register a new user with different credentials
- Set up their profile with different skills
- Send a swap request to your first user
- Switch back to your first user and check the "Incoming" requests tab
- Accept or reject the incoming request

## 🔧 API Testing (Optional)

You can also test the API directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all users
curl http://localhost:3001/api/users

# Get specific user
curl http://localhost:3001/api/users/1

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","location":"Test City"}'
```

## 🎨 Features to Explore

### **Responsive Design**
- Resize your browser window
- Test on mobile view (F12 → Device toolbar)
- Notice the mobile menu in the navbar

### **Search & Filter**
- Search by user names
- Search by skill names
- Filter by availability
- Clear search functionality

### **User Experience**
- Loading states (spinners)
- Error handling
- Form validation
- Smooth transitions and hover effects

### **Profile Management**
- Edit profile information
- Add/remove skills dynamically
- Set profile visibility
- Update availability

## 🐛 Troubleshooting

### If the app doesn't load:
1. Check if both servers are running:
   ```bash
   lsof -i :3001  # Backend
   lsof -i :5173  # Frontend
   ```

2. Restart servers if needed:
   ```bash
   # Kill existing processes
   pkill -f "node server.js"
   pkill -f "vite"
   
   # Restart backend
   cd server && node server.js &
   
   # Restart frontend
   cd client && npm run dev &
   ```

### If API calls fail:
- Check browser console for errors
- Verify the proxy configuration in `client/vite.config.js`
- Ensure backend is running on port 3001

## 📝 Notes

- **Data Persistence**: Currently using in-memory storage, so data will be lost when you restart the server
- **Authentication**: Simple token-based auth (not production-ready)
- **Mock Data**: Pre-populated with 3 users (Sarah, Mike, Emma)
- **Real-time**: No real-time updates (would need WebSocket implementation)

## 🎉 Demo Complete!

You've successfully tested all major features of the Skill Swap Platform:
- ✅ User registration and authentication
- ✅ Profile management
- ✅ User discovery and search
- ✅ Skill swap requests
- ✅ Request management
- ✅ Responsive design

The platform is ready for further development or production deployment! 
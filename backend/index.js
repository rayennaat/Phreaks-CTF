require("dotenv").config(); 
const config = require("./config.json");
const mongoose = require("mongoose");   
mongoose.connect(config.connectionString);
const User = require("./models/user.model");
const Team = require("./models/team.model");
const Challenge = require("./models/challenge.model"); // Adjust path if needed
const Submission = require("./models/submission.model");
const Writeup = require("./models/writeup.model");
const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const crypto = require("crypto"); 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const fs = require('fs');
const path = require('path');

app.use(express.json());

const PORT = 5000;

app.use(
    cors({
        origin: "https://phreaks-ctf-frontend.onrender.com",
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Backend ready !!!

app.post('/upload', (req, res) => { 
  const base64Image = req.body.image; // Get the Base64 string

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');

  const fileName = `${Date.now()}.jpg`; // Unique filename
  const filePath = path.join(__dirname, 'uploads', fileName);

  fs.writeFile(filePath, buffer, err => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error saving image');
      }

      const imageUrl = `/uploads/${fileName}`; // relative path (served already)
      res.json({ message: 'Image uploaded successfully!', url: imageUrl });
  });
});



// Create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password, teamChoice, teamName, teamPassword } = req.body;
    // Validate user fields
    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }
    // Normalize and hash email
    const normalizedEmail = email.trim().toLowerCase();
    const hashedEmail = crypto.createHash("sha256").update(normalizedEmail).digest("hex");
    // Check if user already exists
    const isUser = await User.findOne({ email: hashedEmail });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Get the user's IP address
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // Create user
    const user = new User({
        fullName,
        email: hashedEmail,
        rawEmail: normalizedEmail,
        password: hashedPassword,
        teamId: null, // Initially null, will be updated if a team is created
        ip: ip,
    });
    if (teamChoice === "create") {
        // Validate team fields
        if (!teamName) {
            return res.status(400).json({ error: true, message: "Team Name is required" });
        }
        if (!teamPassword) {
            return res.status(400).json({ error: true, message: "Team Password is required" });
        }
        // Check if team already exists
        const isTeam = await Team.findOne({ name: teamName });
        if (isTeam) {
            return res.status(400).json({ error: true, message: "Team already exists" });
        }
        // Create team
        const team = new Team({
            name: teamName,
            password: teamPassword,
            points: 0, // Default points for a new team
            bio: "",
            link: "",
            teamPic: null,
            adminId: user._id,
        });
        await team.save();
        // Associate user with the newly created team
        user.teamId = team._id;
    } else if (teamChoice === "join") {
        // Join existing team
        if (!teamPassword) {
            return res.status(400).json({ error: true, message: "Team Password is required" });
        }
        const existingTeam = await Team.findOne({ password: teamPassword });
        if (!existingTeam) {
            return res.status(400).json({ error: true, message: "Invalid Team Password" });
        }
        user.teamId = existingTeam._id;
    }
    await user.save();
    // Generate access token
    const accessToken = jwt.sign(
        {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: normalizedEmail, // Use normalized email here
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "36000m" }
    );
    return res.status(201).json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
      }

      const SHA256 = require("crypto-js/sha256");
      const hashedEmail = SHA256(email.trim().toLowerCase()).toString();
      
      const userInfo = await User.findOne({ email: hashedEmail });
      if (!userInfo) {
          return res.status(400).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, userInfo.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      let teamName = null;
      if (userInfo.teamId) {
          const team = await Team.findById(userInfo.teamId);
          if (team) teamName = team.name;
      }

      const accessToken = jwt.sign(
          { 
              user: { 
                  id: userInfo._id, 
                  fullName: userInfo.fullName, 
                  isAdmin: userInfo.isAdmin // Include isAdmin in the token
              } 
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "24h" } 
      );

      return res.status(200).json({
          error: false,
          user: {
              id: userInfo._id,
              fullName: userInfo.fullName,
              team: teamName,
              isAdmin: userInfo.isAdmin, // Send this to the frontend
          },
          accessToken,
          message: "Login Successful",
      });

  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/admin/create-account", async (req, res) => {
  const { fullName, email, password, isAdmin } = req.body;

  // Validate required fields
  if (!fullName) {
      return res.status(400).json({ error: true, message: "Full Name is required" });
  }
  if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
      return res.status(400).json({ error: true, message: "Password is required" });
  }

  // Normalize and hash email
  const normalizedEmail = email.trim().toLowerCase();
  const hashedEmail = crypto.createHash("sha256").update(normalizedEmail).digest("hex");

  // Check if user already exists
  const isUser = await User.findOne({ email: hashedEmail });
  if (isUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Get the user's IP address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Create user
  const user = new User({
      fullName,
      email: hashedEmail,
      rawEmail: normalizedEmail,
      password: hashedPassword,
      teamId: null, // Initially null, can be updated later
      profilePic: null, // Default value if not provided
      ip: ip,
      isAdmin: isAdmin || false, // Set isAdmin based on the request (default to false)
      isBanned: false, // Default to false
      isHidden: false, // Default to false
      banReason: null, // Default to null
      points: 0, // Default points for new users
      createdOn: new Date().getTime(), // Automatically set creation date
  });

  // Save the user to the database
  await user.save();

  // Generate access token (optional, if the admin needs to log in the user immediately)
  const accessToken = jwt.sign(
      {
          user: {
              id: user._id,
              fullName: user.fullName,
              email: normalizedEmail,
              isAdmin: user.isAdmin, // Include isAdmin in the token payload
          },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "36000m" } // Token expiration time
  );

  // Return success response
  return res.status(201).json({
      error: false,
      user,
      accessToken,
      message: "Admin created user account successfully",
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/get-user", authenticateToken, async (req, res) => {
  if (!req.user || !req.user.user || !req.user.user.id) {
      console.log("No valid user ID in request");
      return res.status(403).json({ error: "Invalid or missing token data" });
  }

  console.log("Decoded user:", req.user);

  const userId = req.user.user.id; // Ensure correct ID extraction

  try {
      const isUser = await User.findById(userId); // Use findById instead of findOne

      if (!isUser) {
          console.log(`User with ID ${userId} not found in database`);
          return res.status(404).json({ error: "User not found" });
      }

      let teamName = null;
      if (isUser.teamId) {
          const team = await Team.findById(isUser.teamId);
          if (team) {
              teamName = team.name;
          }
      }

      return res.json({
          user: {
              fullName: isUser.fullName,
              rawEmail: isUser.rawEmail,
              points: isUser.points,
              team: teamName,
              id: isUser._id,
              country: isUser.country || 'Not set', // Include the country field
              link: isUser.link || 'Not set', // Include the link field (optional)
              profilePic: isUser.profilePic || null, // Include the profilePic field
          },
          message: "",
      });
  } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
});


// get teamid for user 
app.get("/get-teamid", authenticateToken, async (req, res) => {
    if (!req.user) {
        console.log("No user found in request");
        return res.sendStatus(403);
    }
    console.log("Decoded user:", req.user); // Debugging: Log the decoded user data
    const { id } = req.user.user; // Access user ID from req.user.user
    try {
        const user = await User.findOne({ _id: id }).select("teamId");
        if (!user) {
            console.log("User not found in database");
            return res.sendStatus(401);
        }
        return res.json({
            teamId: user.teamId || null, // Return null if no teamId is set
            message: user.teamId ? "Team ID retrieved successfully" : "User has no team",
        });
    } catch (error) {
        console.error("Error fetching team ID:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.get("/task/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        // Step 1: Fetch task (challenge) details
        const task = await Challenge.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });
        // Step 2: Fetch user details for solvedByUsers
        const solvedByUsers = await Promise.all(
            task.solvedByUsers.map(async (entry) => {
                const user = await User.findById(entry.user_id);
                return user
                    ? { fullName: user.fullName, time: entry.time }
                    : { fullName: "Unknown", time: entry.time };
            })
        );
        res.json({ ...task.toObject(), solvedByUsers }); // Return task + updated solvedByUsers
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/users/solved", async (req, res) => {
    try {
        const userIds = req.query.userIds?.split(","); // Extract user IDs from query params
        if (!userIds || userIds.length === 0) {
            return res.status(400).json({ error: "No user IDs provided" });
        }
        // Fetch users with only `fullName` and `_id`
        const users = await User.find({ _id: { $in: userIds } }).select("fullName _id");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/challenges/solved-by-user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID." });
      }
  
      // Find challenges where the user is in the solvedByUsers array
      const challenges = await Challenge.find({
        "solvedByUsers.user_id": new mongoose.Types.ObjectId(userId),
      }).select("title category points solvedByUsers"); // Select only necessary fields
  
      // Map the results to include only the relevant data
      const solvedChallenges = challenges.map((challenge) => {
        const solvedByUser = challenge.solvedByUsers.find(
          (entry) => entry.user_id.toString() === userId
        );
        return {
          title: challenge.title,
          category: challenge.category,
          points: solvedByUser.points,
          time: solvedByUser.time, // Time when the user solved the challenge
        };
      });
  
      res.status(200).json(solvedChallenges);
    } catch (error) {
      console.error("Error fetching solved challenges:", error);
      res.status(500).json({ message: "Failed to fetch solved challenges" });
    }
  });

// GET endpoint to fetch users with their team names
app.get('/api/users-with-teams', async (req, res) => {
    try {
        // Fetch all users and populate the team name using teamId
        const users = await User.find({ isBanned: false, isHidden: false, isAdmin: false}).select('fullName teamId country link'); // Select only fullName and teamId
        // Map through the users and add the team name
        const usersWithTeams = await Promise.all(
            users.map(async (user) => {
                const team = await Team.findById(user.teamId).select('name'); // Get the team name
                return {
                    fullName: user.fullName,
                    country: user.country,
                    link: user.link,
                    team: team ? team.name : 'No Team', // If teamId is null, set team to 'No Team'
                };
            })
        );
        res.status(200).json(usersWithTeams);
    } catch (error) {
        console.error('Error fetching users with teams:', error);
        res.status(500).json({ message: 'Failed to fetch users with teams' });
    }
});

app.get('/api/teams', async (req, res) => {
  try {
    // Fetch teams where isBanned and isHidden are false
    const teams = await Team.find({ isBanned: false, isHidden: false })
      .select('name link points country');
    
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});


app.get('/api/teams-admin', async (req, res) => {
    try {
        // Fetch teams with only name and link fields
        const teams = await Team.find().select('name link points isBanned isHidden firstBlood');
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Failed to fetch teams' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('fullName rawEmail points isBanned isHidden banReason isAdmin'); // Fetch rawEmail
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// PUT request to update a user
app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL
    const { isBanned, isHidden, banReason } = req.body; // Get the updated fields from the request body
  
    try {
      // If isBanned is false, reset banReason to an empty string
      const updateFields = {
        isBanned,
        isHidden,
        banReason: isBanned ? banReason : "", // Reset banReason if isBanned is false
      };
  
      // Find the user by ID and update their fields
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true } // Return the updated user
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(updatedUser); // Send the updated user as the response
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });


app.delete("/api/users/delete", async (req, res) => {
    const { userIds } = req.body;
  
    try {
      // Delete users from the database
      await User.deleteMany({ _id: { $in: userIds } }); // Assuming `User` is your Mongoose model
      res.status(200).json({ message: "Users deleted successfully" });
    } catch (error) {
      console.error("Error deleting users:", error);
      res.status(500).json({ error: "Failed to delete users" });
    }
  });

app.put('/putteams/:id', async (req, res) => {
    const { id } = req.params; // Team name or ID
    const updates = req.body; // Fields to update
    try {
        // Find the team by name or ID
        const team = await Team.findOne({
            $or: [{ name: id }, { _id: id }]
        });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Update the team with the provided fields
        Object.keys(updates).forEach((key) => {
            if (key in team) { // Ensure only valid fields are updated
                team[key] = updates[key];
            }
        });
        // Save the updated team
        await team.save();
        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get("/get-team", authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findOne({ _id: req.user.user.id });
    if (!user) return res.sendStatus(401);
    if (!user.teamId) return res.status(404).json({ message: "User is not part of a team" });

    const team = await Team.findOne({ _id: user.teamId });
    if (!team) return res.status(404).json({ message: "Team not found" });

    return res.json({
      team: {
        id: team._id,
        name: team.name,
        points: team.points,
        bio: team.bio,
        link: team.link,
        country: team.country,
        profilePic: team.TeamPic,
        adminId: team.adminId // Just send the adminId
      },
      currentUserId: user._id.toString(), // Send user ID for frontend comparison
      message: "Team details fetched successfully"
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET request to fetch challenges solved by the user's team
app.get('/team/solved-challenges/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        console.log('Team ID:', teamId);
        const challenges = await Challenge.find({
            'solvedByTeams.team_id': teamId.toString(),
        }).select('title category points solvedByTeams');
        const solvedChallenges = challenges.map((challenge) => {
            const solvedByTeam = challenge.solvedByTeams.find(
                (entry) => entry.team_id.toString() === teamId.toString()
            ) || {}; // Prevent undefined
            return {
                title: challenge.title,
                category: challenge.category,
                points: solvedByTeam.points,
                time: solvedByTeam.time || null, // Avoid accessing undefined properties
            };
        }).filter(Boolean); // Remove null values
        res.status(200).json(solvedChallenges);
    } catch (error) {
        console.error('Error fetching solved challenges:', error);
        res.status(500).json({ message: 'Failed to fetch solved challenges' });
    }
});

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
  }
});

const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Add a task
app.post('/add-challenge', upload.single('resource'), async (req, res) => {
    try {
      const { title, pointsMethod, initialValue, decayValue, minimumValue, category, description, hint, flag } = req.body;
      const resource = req.file ? `/uploads/${req.file.filename}` : ""; // Store relative path
  
      // Validate required fields
      if (!title || !category || !flag) {
        return res.status(400).json({ error: "Title, category, and flag are required" });
      }
  
      // Calculate points based on method
      let calculatedPoints = 0;
      if (pointsMethod === "Standard") {
        if (!req.body.points) return res.status(400).json({ error: "Points are required for Standard method" });
        calculatedPoints = parseInt(req.body.points);
      } else {
        calculatedPoints = parseInt(initialValue);
      }
  
      // Create new challenge object
      const newChallenge = new Challenge({
        title,
        pointsMethod,
        points: calculatedPoints,
        initialValue: parseInt(initialValue) || 0,
        decayValue: parseInt(decayValue) || 0,
        minimumValue: parseInt(minimumValue) || 0,
        category,
        description: description || "",
        hint: hint || "",
        resource,
        flag,
        solvedByUsers: [],
        solvedByTeams: []
      });
  
      // Save to database
      await newChallenge.save();
  
      res.status(201).json({ message: "Challenge added successfully!", challenge: newChallenge });
    } catch (error) {
      console.error("Error adding challenge:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

// Get the challenges
app.get("/api/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find(); // Assuming `Challenge` is your Mongoose model
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Submit challenge
app.post('/submit-challenge/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { flag } = req.body;
    const userId = req.user.user.id;
    const userFullName = req.user.user.fullName;

    if (!flag) return res.status(400).json({ error: "Flag is required." });

    const challenge = await Challenge.findById(taskId);
    if (!challenge) return res.status(404).json({ error: "Challenge not found." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const team = await Team.findById(user.teamId);
    if (!team) return res.status(404).json({ error: "Team not found." });

    const isCorrect = challenge.flag.toLowerCase() === flag.toLowerCase();
    const now = new Date();

    // Calculate points to award (using your existing calculatePoints function)
    const pointsToAward = isCorrect ? calculatePoints(challenge, challenge.solvedByUsers.length + 1) : 0;

    // Save the submission attempt
    await Submission.create({
      userFullName,
      userTeamName: team.name,
      challengeTitle: challenge.title,
      type: isCorrect ? "Correct" : "Incorrect",
      providedFlag: flag,
      date: now,
      method: challenge.pointsMethod, // Include method field
      points: pointsToAward, // Include points field
    });

    if (!isCorrect) return res.status(200).json({ message: "Incorrect flag." });

    // Check if the user already solved this challenge
    const alreadySolved = challenge.solvedByUsers.some(entry => entry.user_id.equals(userId));
    if (alreadySolved) return res.status(400).json({ error: "Challenge already solved by this user." });

    // Fetch the current points of the challenge BEFORE applying decay
    const currentPoints = challenge.points;

    // Award the current points to the user and team
    user.points += currentPoints;
    team.points += currentPoints;

    // **First Blood Logic**
    if (challenge.solvedByTeams.length === 0) {
      team.firstBlood += 1; // Increment firstBlood if no team has solved this challenge before
    }

    // Update challenge with user/team who solved it
    challenge.solvedByUsers.push({ user_id: userId, time: now, points: currentPoints });
    challenge.solvedByTeams.push({ team_id: user.teamId, time: now, points: currentPoints });

    // Apply decay if needed
    if (challenge.pointsMethod !== "Standard" && challenge.points > challenge.minimumValue) {
      if (challenge.pointsMethod === "Linear") {
        challenge.points = Math.max(challenge.points - challenge.decayValue, challenge.minimumValue);
      } else if (challenge.pointsMethod === "Logarithmic") {
        const solveCount = challenge.solvedByUsers.length + 1;
        challenge.points = Math.max(
          (((challenge.minimumValue - challenge.initialValue) / (Math.pow(challenge.decayValue, 2))) * Math.pow(solveCount, 2)) + challenge.initialValue,
          challenge.minimumValue
        );
      }
    }

    await Promise.all([challenge.save(), user.save(), team.save()]);
    return res.status(200).json({ message: "Correct flag!", pointsAwarded: currentPoints });
  } catch (error) {
    console.error("Error submitting challenge:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
  
  // Function to calculate points based on the method
  function calculatePoints(challenge, solveCount) {
    if (challenge.pointsMethod === "Standard") {
      return challenge.points;
    } else if (challenge.pointsMethod === "Linear") {
      return Math.max(challenge.initialValue - (challenge.decayValue * solveCount), challenge.minimumValue);
    } else if (challenge.pointsMethod === "Logarithmic") {
      return Math.max(
        (((challenge.minimumValue - challenge.initialValue) / (Math.pow(challenge.decayValue, 2))) * Math.pow(solveCount, 2)) + challenge.initialValue,
        challenge.minimumValue
      );
    }
    return 0; // Default to 0 if unknown method
  }


// Delete all challenges
app.delete('/api/all-challenges', async (req, res) => {
    try {
      // Delete all challenges from the database
      await Challenge.deleteMany({});
      res.status(200).json({ message: "All challenges deleted successfully" });
    } catch (error) {
      console.error("Error deleting challenges:", error.message);
      res.status(500).json({ error: error.message });
    }
});

app.delete('/api/delete-challenges', async (req, res) => {
    try {
      const { challengeIds } = req.body;
  
      // Validate challengeIds
      if (!challengeIds || !Array.isArray(challengeIds)) {
        return res.status(400).json({ error: "Invalid challenge IDs provided" });
      }
  
      // Delete the selected challenges
      await Challenge.deleteMany({ _id: { $in: challengeIds } });
  
      res.status(200).json({ message: "Challenges deleted successfully" });
    } catch (error) {
      console.error("Error deleting challenges:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/challenges/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid challenge ID" });
      }
  
      // Find the challenge by ID
      const challenge = await Challenge.findById(id);
  
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
  
      // Return the challenge data
      res.status(200).json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  //edit challenge
  app.put('/api/challenges/:id', upload.single('resource'), async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // If a file was uploaded, add it to the updated data
      if (req.file) {
        updatedData.resource = `/uploads/${req.file.filename}`; // Store relative path
      }
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid challenge ID" });
      }
  
      // Find and update the challenge
      const updatedChallenge = await Challenge.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedChallenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
  
      // Return the updated challenge
      res.status(200).json(updatedChallenge);
    } catch (error) {
      console.error("Error updating challenge:", error.message);
      res.status(500).json({ error: error.message });
    }
  });


// Get all submissions
app.get('/api/submissions', async (req, res) => {
    try {
      const submissions = await Submission.find(); // Fetch all submissions
      res.status(200).json(submissions); // Return the submissions
    } catch (error) {
      console.error("Error fetching submissions:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  });

// Delete all submissions
app.delete("/submissions", async (req, res) => {
    try {
        await Submission.deleteMany({});
        return res.json({ message: "All submissions deleted successfully." });
    } catch (error) {
        console.error("Error deleting submissions:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Delete a specific submission by ID
app.delete("/submissions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubmission = await Submission.findByIdAndDelete(id);
        if (!deletedSubmission) {
            return res.status(404).json({ message: "Submission not found." });
        }
        return res.json({ message: "Submission deleted successfully." });
    } catch (error) {
        console.error("Error deleting submission:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


app.get("/get-all-users", authenticateToken, async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        // Return the list of users
        res.json({
            users: users.map(user => ({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/get-usere/:id", authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;
      // Check if the provided ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid user ID' });
      }
      // Fetch the user by ID from the database
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Return the user data
      res.json({
          user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              country: user.country, // Include country
              link: user.link, // Include link
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All teams for admin
app.get("/admin/teams", async (req, res) => {
    try {
        const teams = await Team.find({}, "name isBanned isHidden banReason firstBlood"); // Fetch only 'name' field
        res.json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/api/teams/delete", async (req, res) => {
    const { teamIds } = req.body; // Array of team IDs to delete
  
    try {
      // Delete teams with IDs in the `teamIds` array
      await Team.deleteMany({ _id: { $in: teamIds } }); // Assuming `Team` is your Mongoose model
      res.status(200).json({ message: "Teams deleted successfully" });
    } catch (error) {
      console.error("Error deleting teams:", error);
      res.status(500).json({ message: "Failed to delete teams" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    const { id } = req.params; // Get the team ID from the URL
    const { isBanned, isHidden, banReason } = req.body; // Get the updated fields from the request body
  
    try {
      // If isBanned is false, reset banReason to an empty string
      const updateFields = {
        isBanned,
        isHidden,
        banReason: isBanned ? banReason : "", // Reset banReason if isBanned is false
      };
  
      // Find the team by ID and update their fields
      const updatedTeam = await Team.findByIdAndUpdate(
        id,
        updateFields,
        { new: true } // Return the updated team
      );
  
      if (!updatedTeam) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      res.status(200).json(updatedTeam); // Send the updated team as the response
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ message: "Failed to update team" });
    }
  });

  app.post("/api/writeups", async (req, res) => {
    try {
      const { title, date, summary, description, category } = req.body;
  
      if (!summary || !description) {
        return res.status(400).json({ message: "Summary and description are required." });
      }
  
      const newWriteup = new Writeup({
        title: title || "Untitled Writeup",
        date: date || new Date(),
        summary,
        description,
        category: category || "General",
      });
  
      await newWriteup.save();
      res.status(201).json({ message: "Writeup created successfully!", writeup: newWriteup });
    } catch (error) {
      console.error("Error saving writeup:", error);
      res.status(500).json({ message: "Failed to create writeup." });
    }
  });

  app.get("/api/writeups", async (req, res) => {
    try {
        const writeups = await Writeup.find({ pending: false }); // Fetch all writeups
        res.status(200).json(writeups);
    } catch (error) {
        console.error("Error fetching writeups:", error);
        res.status(500).json({ message: "Failed to fetch writeups." });
    }
});

app.get("/api/writeups/admin", async (req, res) => {
  try {
    const pending = await Writeup.find({ pending: true });
    const approved = await Writeup.find({ pending: false });

    res.json({ pending, approved });
  } catch (error) {
    res.status(500).json({ message: "Error fetching writeups", error });
  }
});

app.put("/api/writeups/:id/approve", async (req, res) => {
  try {
    const writeup = await Writeup.findByIdAndUpdate(
      req.params.id,
      { pending: false }, // Update `pending` to false
      { new: true }
    );

    if (!writeup) {
      return res.status(404).json({ message: "Writeup not found" });
    }

    res.json({ message: "Writeup approved", writeup });
  } catch (error) {
    console.error("Error approving writeup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/api/writeups/:id", async (req, res) => {
  try {
    const writeup = await Writeup.findById(req.params.id);
    if (!writeup) {
      return res.status(404).json({ message: "Writeup not found" });
    }

    // Check if the current user has liked the writeup
    const userId = req.user?.user?.id; // Extract user ID from token
    const userLiked = userId && writeup.likes.includes(userId);

    res.json({
      ...writeup.toObject(), // Include all writeup fields
      userLiked, // Add userLiked field
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/writeups/:id/like", authenticateToken, async (req, res) => {
  try {
    const writeup = await Writeup.findById(req.params.id);
    if (!writeup) return res.status(404).json({ message: "Writeup not found" });

    const userId = req.user?.user?.id; // ✅ Fix: Extract user ID properly
    if (!userId) {
      console.log("Invalid user ID in token:", req.user);
      return res.status(401).json({ message: "Unauthorized: Invalid user ID" });
    }

    console.log("User ID from token:", userId); // 🔍 Debugging log

    // Ensure `likes` is an array of ObjectId references
    if (!Array.isArray(writeup.likes)) {
      writeup.likes = [];
    }

    // Check if the user has already liked the writeup
    const userIndex = writeup.likes.findIndex(id => id.toString() === userId);

    if (userIndex === -1) {
      // ✅ Like the writeup (only once per user)
      writeup.likes.push(userId);
    } else {
      // ✅ Unlike the writeup if already liked
      writeup.likes.splice(userIndex, 1);
    }

    await writeup.save();

    res.json({
      liked: userIndex === -1, // true if user just liked, false if unliked
      likesCount: writeup.likes.length,
    });
  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/api/writeups", async (req, res) => {
  try {
    // Delete all documents in the Writeup collection
    const result = await Writeup.deleteMany({});

    // Check if any writeups were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No writeups found to delete." });
    }

    // Return success message
    res.json({ message: `Successfully deleted ${result.deletedCount} writeups.` });
  } catch (error) {
    console.error("Error deleting writeups:", error);
    res.status(500).json({ message: "Server error while deleting writeups." });
  }
});

app.delete("/api/writeups/:id", async (req, res) => {
  try {
    const writeup = await Writeup.findByIdAndDelete(req.params.id); // Find and delete the writeup
    if (!writeup) {
      return res.status(404).json({ message: "Writeup not found" });
    }
    res.json({ message: "Writeup deleted successfully!" });
  } catch (error) {
    console.error("Error deleting writeup:", error);
    res.status(500).json({ message: "Failed to delete writeup." });
  }
});

// CHARTS
// RADAR CHART FOR USER
app.get('/api/user-solved-challenges', async (req, res) => {
  const { userId } = req.query;
  try {
    const challenges = await Challenge.find({
      solvedByUsers: { $elemMatch: { user_id: userId } },
    });
    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch solved challenges' });
  }
});

// Update fullName, password, profilePic
app.post('/api/users/:id', authenticateToken, upload.single('profilePic'), async (req, res) => {
  const { fullName, password } = req.body;
  const updates = {};

  if (fullName !== undefined) updates.fullName = fullName;
  if (password !== undefined) updates.password = await bcrypt.hash(password, 10);
  if (req.file) updates.profilePic = req.file.path;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User info updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user info' });
  }
});


// Update country and link
app.post('/api/users/:id/details', authenticateToken, async (req, res) => {
  const { country, link } = req.body;
  const updates = {};

  // Only add fields to the updates object if they are provided
  if (country !== undefined) updates.country = country;
  if (link !== undefined) updates.link = link;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Details updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Failed to update details' });
  }
});


// Update team details (country, link, bio)
app.post('/api/teams/:id/details', authenticateToken, async (req, res) => {
  const { country, link, bio } = req.body;
  const updates = {};

  // Only add fields to the updates object if they are provided
  if (country !== undefined) updates.country = country;
  if (link !== undefined) updates.link = link;
  if (bio !== undefined) updates.bio = bio;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Team details updated', team: updatedTeam });
  } catch (error) {
    console.error('Error updating team details:', error);
    res.status(500).json({ message: 'Failed to update team details' });
  }
});


// Update team name, password, TeamPic
app.post('/api/teams/:id', authenticateToken, upload.single('TeamPic'), async (req, res) => {
  const { name, password } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (password !== undefined) updates.password = await bcrypt.hash(password, 10);
  if (req.file) updates.TeamPic = req.file.path;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Team info updated', team: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Failed to update team info' });
  }
});

//team members card 
// Assuming you have a Team model with a members array or you store the teamId in each user.
app.get('/api/teams/:teamId/members', authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    // If your User schema includes teamId
    const members = await User.find({ teamId });

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch team members' });
  }
});


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;
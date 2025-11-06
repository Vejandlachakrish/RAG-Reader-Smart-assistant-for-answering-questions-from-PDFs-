const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Multer setup for handling multipart/form-data (no file uploads, just form fields)
const upload = multer({ storage: multer.memoryStorage() });

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'srimanraoch@gmail.com', // Replace with your Gmail address
        pass: 'ncba ksjx iyru wbgm' // Replace with your Gmail App Password
    }
});

// Middleware
app.use(bodyParser.json()); // For JSON API endpoints
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read user data from users.json
function readUsers() {
    try {
        if (!fs.existsSync('users.json')) {
            console.log('users.json does not exist, creating an empty one.');
            fs.writeFileSync('users.json', JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync('users.json');
        const users = JSON.parse(data);
        if (!Array.isArray(users)) {
            console.error('users.json is not an array, resetting to empty array.');
            return [];
        }
        return users;
    } catch (err) {
        console.error('Error reading users.json:', err.message);
        return [];
    }
}

// Write user data to users.json
function writeUsers(users) {
    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        console.log('Successfully wrote to users.json');
    } catch (err) {
        console.error('Error writing to users.json:', err.message);
        throw new Error('Failed to write to users.json');
    }
}

// Root route: Serve login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route: Signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route: Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route: Forgot password page
app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forgot.html'));
});

// Route: Reset password page
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset.html'));
});

// Route: Profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Route: Home page (after login)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Route: Chatbot page
app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// POST: Signup
app.post('/signup', upload.none(), async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, dateOfBirth, age, gender, profession, studyField, jobRole, otherProfession, password, confirmPassword } = req.body;
        console.log('Signup attempt with email:', email);
        console.log('Received signup data:', req.body);

        if (!email) {
            console.error('Email field missing in signup request');
            return res.status(400).json({ message: 'Email is required' });
        }

        if (password !== confirmPassword) {
            console.error('Passwords do not match for email:', email);
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const users = readUsers();
        const userExists = users.find(user => user.email.toLowerCase() === email.toLowerCase());

        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            firstName,
            lastName,
            mobile,
            email: email.toLowerCase().trim(), // Normalize email on signup
            dateOfBirth,
            age,
            gender,
            profession,
            studyField: profession === 'student' ? studyField : undefined,
            jobRole: profession === 'employee' ? jobRole : undefined,
            otherProfession: profession === 'other' ? otherProfession : undefined,
            password: hashedPassword,
            passcode: null // Initialize passcode for password reset
        };
        users.push(userData);
        writeUsers(users);
        console.log('User successfully saved:', userData);
        console.log('Updated users.json:', users);
        res.json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Error creating account. Please try again.' });
    }
});

// POST: Login
app.post('/login', upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email);
        const users = readUsers();
        console.log('Current users in database:', users);
        const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log('Account not found for email:', email);
            return res.status(401).json({ message: 'Account doesn\'t exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid password for email:', email);
            return res.status(401).json({ message: 'Invalid password' });
        }

        console.log('Login successful for email:', email);
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Error during login. Please try again.' });
    }
});

// GET: Fetch user profile
app.get('/api/profile', (req, res) => {
    const { email } = req.query;
    console.log('Profile request for email:', email);
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const users = readUsers();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        age: user.age,
        gender: user.gender,
        profession: user.profession,
        studyField: user.studyField,
        jobRole: user.jobRole,
        otherProfession: user.otherProfession
    };

    res.json(userProfile);
});

// POST: Check email for password reset
app.post('/api/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Check email attempt:', email);
        if (!email) {
            console.error('Email missing in check-email request');
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!user) {
            console.log('Email not found:', normalizedEmail);
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate passcode
        const passcode = String(Math.floor(100000 + Math.random() * 900000)); // Ensure passcode is a string
        user.passcode = passcode;
        try {
            writeUsers(users);
            console.log('Passcode saved to users.json for email:', normalizedEmail, 'Passcode:', passcode);
        } catch (writeError) {
            console.error('Failed to write passcode to users.json:', writeError.message);
            return res.status(500).json({ message: 'Error saving passcode. Please try again.' });
        }

        // Send email with passcode
        const mailOptions = {
            from: 'your-email@gmail.com', // Replace with your Gmail address
            to: email,
            subject: 'Password Reset Passcode',
            text: `Your password reset passcode is: ${passcode}\n\nPlease use this passcode to reset your password.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Passcode sent to ${email}: ${passcode}`);
        res.json({ success: true, message: 'Passcode sent to email' });
    } catch (error) {
        console.error('Password reset error:', error.message);
        res.status(500).json({ message: 'Error sending passcode. Please try again.' });
    }
});

// POST: Verify passcode
app.post('/api/verify-passcode', (req, res) => {
    try {
        const { email, passcode } = req.body;
        console.log('Verify passcode attempt for email:', email, 'with passcode:', passcode);
        if (!email) {
            console.error('Email missing in verify-passcode request');
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!passcode) {
            console.error('Passcode missing in verify-passcode request');
            return res.status(400).json({ message: 'Passcode is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const users = readUsers();
        console.log('Current users in database:', users);
        const user = users.find(user => user.email.toLowerCase() === normalizedEmail);

        if (!user) {
            console.log('Email not found in database:', normalizedEmail);
            return res.status(404).json({ message: 'Email not found' });
        }

        const storedPasscode = String(user.passcode); // Ensure stored passcode is a string
        const enteredPasscode = String(passcode); // Ensure entered passcode is a string
        console.log('User found:', user.email, 'Stored passcode:', storedPasscode);

        if (storedPasscode !== enteredPasscode) {
            console.log('Invalid passcode for email:', normalizedEmail, 'Entered:', enteredPasscode, 'Expected:', storedPasscode);
            return res.status(401).json({ message: 'Invalid passcode' });
        }

        // Clear passcode after verification
        user.passcode = null;
        try {
            writeUsers(users);
            console.log('Passcode verified and cleared for email:', normalizedEmail);
        } catch (writeError) {
            console.error('Failed to clear passcode in users.json:', writeError.message);
            return res.status(500).json({ message: 'Error clearing passcode. Please try again.' });
        }

        res.json({ success: true, message: 'Passcode verified' });
    } catch (error) {
        console.error('Error during passcode verification:', error.message);
        res.status(500).json({ message: 'Error verifying passcode. Please try again.' });
    }
});

// POST: Reset password
app.post('/api/reset-password', upload.none(), async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        console.log('Password reset attempt for email:', email);
        console.log('Received reset data:', req.body);

        if (!email) {
            console.error('Email field missing in reset request');
            return res.status(400).json({ message: 'Email is required' });
        }

        if (newPassword !== confirmPassword) {
            console.error('Passwords do not match for email:', email);
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const users = readUsers();
        const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());

        if (userIndex === -1) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        users[userIndex].password = hashedPassword;
        writeUsers(users);
        console.log('Password reset successful for email:', email);
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error.message);
        res.status(500).json({ message: 'Error resetting password. Please try again.' });
    }
});

// POST: Update profile
app.post('/api/update-profile', upload.none(), async (req, res) => {
    try {
        console.log('Received update profile request:', req.body);
        const { firstName, lastName, mobile, email, dateOfBirth, age, gender, profession, studyField, jobRole, otherProfession } = req.body;

        if (!email) {
            console.error('Email field missing in update request');
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log('Normalized email for update:', normalizedEmail);

        const users = readUsers();
        console.log('Current users in database:', users);
        const userIndex = users.findIndex(user => user.email.toLowerCase() === normalizedEmail);

        if (userIndex === -1) {
            console.log('User not found for email:', normalizedEmail);
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = {
            ...users[userIndex],
            firstName: firstName || users[userIndex].firstName,
            lastName: lastName || users[userIndex].lastName,
            mobile: mobile || users[userIndex].mobile,
            email: normalizedEmail, // Ensure email is normalized
            dateOfBirth: dateOfBirth || users[userIndex].dateOfBirth,
            age: age || users[userIndex].age,
            gender: gender || users[userIndex].gender,
            profession: profession || users[userIndex].profession,
            studyField: profession === 'student' ? studyField : undefined,
            jobRole: profession === 'employee' ? jobRole : undefined,
            otherProfession: profession === 'other' ? otherProfession : undefined,
        };

        users[userIndex] = updatedUser;
        writeUsers(users);
        console.log('User profile updated:', updatedUser);
        console.log('Updated users.json:', users);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Error updating profile. Please try again.' });
    }
});

// POST: Logout
app.post('/logout', (req, res) => {
    console.log('Logout request received');
    res.json({ message: 'Logout successful' });
});

// Email verification endpoint
app.post('/api/send-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        // In production, you would:
        // 1. Generate a verification token
        // 2. Save it to the user's record in database
        // 3. Send an email with verification link
        
        // For demo purposes, we'll just log the "sent" email
        console.log(`Verification email would be sent to: ${email}`);
        
        res.json({ 
            success: true, 
            message: 'Verification email sent' 
        });
    } catch (error) {
        console.error('Email verification error:', error.message);
        res.status(500).json({ message: 'Error sending verification email' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
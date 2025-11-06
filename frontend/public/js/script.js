document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const toggleThemeButton = document.getElementById('theme-toggle');
    const applyTheme = () => {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        if (toggleThemeButton) {
            toggleThemeButton.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
        }
    };

    // Apply theme on page load
    applyTheme();

    if (toggleThemeButton) {
        toggleThemeButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleThemeButton.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        });
    }

    const forms = document.querySelectorAll('form');
    let userEmail = '';

    // Protect /home, /profile, and /reset-password routes: Redirect to /login if userEmail is not set
    if (window.location.pathname === '/home' || window.location.pathname === '/profile' || window.location.pathname === '/reset-password') {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            console.log('No user email found in localStorage. Redirecting to login.');
            window.location.href = '/login';
            return;
        }
        userEmail = email.toLowerCase().trim(); // Normalize email to lowercase and remove spaces
        console.log('User email loaded from localStorage:', userEmail);
    }

    // Handle reset password page load
    if (window.location.pathname === '/reset-password') {
        const resetEmailInput = document.getElementById('reset-email');
        if (resetEmailInput) {
            resetEmailInput.value = userEmail; // Set the hidden email field
            console.log('Set reset-email field to:', userEmail);
        }
    }

    // Handle home page welcome message
    if (window.location.pathname === '/home') {
        fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`)
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    console.error('Failed to load profile for welcome message:', result.message);
                    alert(result.message || 'Failed to load user data.');
                    return;
                }
                const userNameSpan = document.getElementById('user-name');
                if (userNameSpan) {
                    userNameSpan.textContent = result.firstName || 'User';
                }
            })
            .catch(error => {
                console.error('Error fetching profile for welcome message:', error);
                alert('An error occurred while loading your profile.');
            });
    }

    // Handle forgot password functionality
    const emailSection = document.getElementById('email-section');
    const passcodeSection = document.getElementById('passcode-section');
    const submitEmailButton = document.getElementById('submit-email');
    const verifyPasscodeButton = document.getElementById('verify-passcode');
    const errorMessage = document.getElementById('error-message');

    // Load userEmail from localStorage if on forgot-password page
    if (window.location.pathname === '/forgot-password') {
        userEmail = localStorage.getItem('resetEmail') || '';
        console.log('Loaded resetEmail from localStorage on forgot-password page:', userEmail);
    }

    if (submitEmailButton) {
        submitEmailButton.addEventListener('click', async () => {
            const email = document.getElementById('email').value.trim();
            if (!email) {
                errorMessage.textContent = 'Email is required';
                return;
            }
            try {
                console.log('Sending email check request for:', email);
                const response = await fetch('/api/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const result = await response.json();
                console.log('Email check response:', result);
                if (response.ok && result.success) {
                    userEmail = email.toLowerCase().trim(); // Normalize email
                    localStorage.setItem('resetEmail', userEmail); // Store email for passcode verification
                    console.log('Email verified, userEmail set to:', userEmail, 'and stored in localStorage');
                    emailSection.style.display = 'none';
                    passcodeSection.style.display = 'block';
                    errorMessage.textContent = '';
                } else {
                    errorMessage.textContent = result.message || 'Email not found';
                }
            } catch (error) {
                console.error('Error during email check:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    if (verifyPasscodeButton) {
        verifyPasscodeButton.addEventListener('click', async () => {
            const passcode = document.getElementById('passcode').value.trim();
            if (!passcode) {
                errorMessage.textContent = 'Passcode is required';
                return;
            }
            if (!userEmail) {
                console.error('userEmail is not set during passcode verification');
                errorMessage.textContent = 'Email not set. Please go back and enter your email again.';
                return;
            }
            try {
                console.log('Verifying passcode for email:', userEmail, 'Passcode:', passcode);
                const response = await fetch('/api/verify-passcode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, passcode })
                });
                console.log('Passcode verification response status:', response.status);
                const result = await response.json();
                console.log('Passcode verification response:', result);
                if (response.ok && result.success) {
                    localStorage.setItem('userEmail', userEmail); // Store normalized email for reset-password page
                    localStorage.removeItem('resetEmail'); // Clear reset email
                    console.log('Passcode verified, redirecting to /reset-password');
                    // Use both methods to ensure redirect
                    window.location.href = '/reset-password';
                    window.location.replace('/reset-password');
                } else {
                    if (response.status === 404) {
                        errorMessage.textContent = 'Email not found. Please go back and try again.';
                    } else if (response.status === 401) {
                        errorMessage.textContent = result.message || 'Invalid passcode.';
                    } else {
                        errorMessage.textContent = result.message || 'Passcode verification failed.';
                    }
                }
            } catch (error) {
                console.error('Error during passcode verification:', error);
                errorMessage.textContent = 'An error occurred while verifying the passcode. Please try again.';
            }
        });
    }

    // Handle profile page load
    if (window.location.pathname === '/profile') {
        const profileDetails = document.getElementById('profile-details');
        const editProfileForm = document.getElementById('edit-profile-form');
        const editProfileButton = document.getElementById('edit-profile-button');
        const cancelEditButton = document.getElementById('cancel-edit-button');

        // Fetch and display profile data
        const loadProfile = () => {
            fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`)
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        console.error('Failed to load profile:', result.message);
                        alert(result.message || 'Failed to load profile.');
                        return;
                    }
                    // Display profile details
                    document.getElementById('profile-firstName').textContent = result.firstName || 'N/A';
                    document.getElementById('profile-lastName').textContent = result.lastName || 'N/A';
                    document.getElementById('profile-mobile').textContent = result.mobile || 'N/A';
                    document.getElementById('profile-email').textContent = result.email || 'N/A';
                    document.getElementById('profile-dateOfBirth').textContent = result.dateOfBirth || 'N/A';
                    document.getElementById('profile-age').textContent = result.age || 'N/A';
                    document.getElementById('profile-gender').textContent = result.gender || 'N/A';
                    document.getElementById('profile-profession').textContent = result.profession || 'N/A';
                    document.getElementById('profile-studyField-value').textContent = result.studyField || 'N/A';
                    document.getElementById('profile-jobRole-value').textContent = result.jobRole || 'N/A';
                    document.getElementById('profile-otherProfession-value').textContent = result.otherProfession || 'N/A';
                    document.getElementById('profile-fullname').textContent = `${result.firstName || 'User'} ${result.lastName || ''} Profile`;

                    // Populate edit form
                    document.getElementById('edit-firstName').value = result.firstName || '';
                    document.getElementById('edit-lastName').value = result.lastName || '';
                    document.getElementById('edit-mobile').value = result.mobile || '';
                    document.getElementById('edit-email').value = result.email || '';
                    document.getElementById('edit-email').setAttribute('readonly', 'readonly'); // Prevent email changes
                    document.getElementById('edit-dateOfBirth').value = result.dateOfBirth || '';
                    document.getElementById('edit-age').value = result.age || '';
                    document.getElementById('edit-gender').value = result.gender || '';
                    document.getElementById('edit-profession').value = result.profession || '';
                    document.getElementById('edit-studyField').value = result.studyField || '';
                    document.getElementById('edit-jobRole').value = result.jobRole || '';
                    document.getElementById('edit-otherProfession').value = result.otherProfession || '';

                    // Trigger profession subfield visibility
                    const professionSelect = document.getElementById('edit-profession');
                    const professionSubfield = document.getElementById('edit-profession-subfield');
                    const studyFieldInput = document.getElementById('edit-studyField');
                    const jobRoleInput = document.getElementById('edit-jobRole');
                    const otherProfessionInput = document.getElementById('edit-otherProfession');
                    if (professionSelect.value === 'student') {
                        professionSubfield.style.display = 'block';
                        studyFieldInput.style.display = 'block';
                        studyFieldInput.setAttribute('required', 'true');
                        jobRoleInput.style.display = 'none';
                        otherProfessionInput.style.display = 'none';
                    } else if (professionSelect.value === 'employee') {
                        professionSubfield.style.display = 'block';
                        jobRoleInput.style.display = 'block';
                        jobRoleInput.setAttribute('required', 'true');
                        studyFieldInput.style.display = 'none';
                        otherProfessionInput.style.display = 'none';
                    } else if (professionSelect.value === 'other') {
                        professionSubfield.style.display = 'block';
                        otherProfessionInput.style.display = 'block';
                        otherProfessionInput.setAttribute('required', 'true');
                        studyFieldInput.style.display = 'none';
                        jobRoleInput.style.display = 'none';
                    } else {
                        professionSubfield.style.display = 'none';
                        studyFieldInput.style.display = 'none';
                        jobRoleInput.style.display = 'none';
                        otherProfessionInput.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    alert('An error occurred while loading your profile.');
                });
        };

        loadProfile();

        // Toggle edit form
        if (editProfileButton) {
            editProfileButton.addEventListener('click', () => {
                profileDetails.style.display = 'none';
                editProfileForm.style.display = 'block';
                editProfileButton.style.display = 'none';
            });
        }

        // Cancel edit
        if (cancelEditButton) {
            cancelEditButton.addEventListener('click', () => {
                profileDetails.style.display = 'block';
                editProfileForm.style.display = 'none';
                editProfileButton.style.display = 'block';
                errorMessage.textContent = '';
                // Reload profile to reset form values
                loadProfile();
            });
        }

        // Handle edit form submission
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(editProfileForm);
                const errorDiv = document.getElementById('error-message');
                let isValid = true;
                let errorMsg = '';

                // Ensure email is included in FormData
                formData.set('email', userEmail); // Explicitly set email from localStorage
                console.log('Form data being submitted:', Object.fromEntries(formData));

                // Client-side validation
                const inputs = editProfileForm.querySelectorAll('input');
                const selects = editProfileForm.querySelectorAll('select');

                inputs.forEach(input => {
                    const value = input.value.trim();
                    const name = input.name;

                    if (name === 'email') return; // Skip email validation since it's readonly

                    if (!value && input.hasAttribute('required')) {
                        errorMsg = `${input.placeholder} is required.`;
                        input.focus();
                        isValid = false;
                        return false;
                    }

                    if (name === 'age') {
                        const age = parseInt(value);
                        if (isNaN(age) || age < 1 || age > 120) {
                            errorMsg = 'Please enter a valid age (1-120).';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }

                    if (name === 'dateOfBirth') {
                        const date = new Date(value);
                        if (isNaN(date.getTime()) || date > new Date()) {
                            errorMsg = 'Please enter a valid date of birth.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }
                });

                selects.forEach(select => {
                    if (!select.value && select.hasAttribute('required')) {
                        errorMsg = `Please select a ${select.name}.`;
                        select.focus();
                        isValid = false;
                        return false;
                    }
                });

                if (!isValid) {
                    errorDiv.textContent = errorMsg;
                    return;
                }

                try {
                    const response = await fetch('/api/update-profile', {
                        method: 'POST',
                        body: formData
                    });

                    console.log('Response status:', response.status);
                    const result = await response.json();
                    console.log('Server response:', result);

                    if (response.ok) {
                        // Reload profile data and switch back to display mode
                        profileDetails.style.display = 'block';
                        editProfileForm.style.display = 'none';
                        editProfileButton.style.display = 'block';
                        errorDiv.textContent = '';
                        loadProfile();
                    } else {
                        if (response.status === 404) {
                            errorDiv.textContent = 'User not found. Please ensure you are logged in with the correct email.';
                        } else if (response.status === 400) {
                            errorDiv.textContent = result.message || 'Invalid data submitted.';
                        } else {
                            errorDiv.textContent = result.message || 'Failed to update profile.';
                        }
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    errorDiv.textContent = 'An error occurred while communicating with the server. Please try again.';
                }
            });
        }
    }

    // Handle back button on profile page
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/home';
        });
    }

    // Handle bot button (placeholder)
    const botButton = document.getElementById('bot-button');
    if (botButton) {
        botButton.addEventListener('click', () => {
            // Placeholder - no action
            console.log('Button to Bot clicked');
        });
    }

    // Handle logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await fetch('/logout', { method: 'POST' });
                localStorage.removeItem('userEmail'); // Clear stored email
                window.location.href = '/login';
            } catch (error) {
                console.error('Error during logout:', error);
                localStorage.removeItem('userEmail');
                window.location.href = '/login';
            }
        });
    }

    forms.forEach(form => {
        const professionSelect = form.querySelector('#profession');
        const studyFieldInput = form.querySelector('#studyField');
        const jobRoleInput = form.querySelector('#jobRole');
        const otherProfessionInput = form.querySelector('#otherProfession');
        const professionSubfield = form.querySelector('#profession-subfield');

        // Profession subfield logic
        if (professionSelect && professionSubfield) {
            professionSelect.addEventListener('change', () => {
                studyFieldInput.style.display = 'none';
                jobRoleInput.style.display = 'none';
                otherProfessionInput.style.display = 'none';
                professionSubfield.style.display = 'none';

                if (professionSelect.value === 'student') {
                    professionSubfield.style.display = 'block';
                    studyFieldInput.style.display = 'block';
                    studyFieldInput.setAttribute('required', 'true');
                    jobRoleInput.removeAttribute('required');
                    otherProfessionInput.removeAttribute('required');
                } else if (professionSelect.value === 'employee') {
                    professionSubfield.style.display = 'block';
                    jobRoleInput.style.display = 'block';
                    jobRoleInput.setAttribute('required', 'true');
                    studyFieldInput.removeAttribute('required');
                    otherProfessionInput.removeAttribute('required');
                } else if (professionSelect.value === 'other') {
                    professionSubfield.style.display = 'block';
                    otherProfessionInput.style.display = 'block';
                    otherProfessionInput.setAttribute('required', 'true');
                    studyFieldInput.removeAttribute('required');
                    jobRoleInput.removeAttribute('required');
                } else {
                    studyFieldInput.removeAttribute('required');
                    jobRoleInput.removeAttribute('required');
                    otherProfessionInput.removeAttribute('required');
                }
            });
        }

        // Form submission handling for signup, login, and reset password forms
        if (form.id === 'signup-form' || form.id === 'login-form' || form.id === 'reset-form') {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const inputs = form.querySelectorAll('input');
                const selects = form.querySelectorAll('select');
                let isValid = true;
                let errorMessage = '';
                const errorDiv = form.querySelector('.error-message') || document.createElement('div');

                inputs.forEach(input => {
                    const value = input.value.trim();
                    const name = input.name;

                    if (!value && input.hasAttribute('required')) {
                        errorMessage = `${input.placeholder} is required.`;
                        input.focus();
                        isValid = false;
                        return false;
                    }

                    if (name === 'email' && form.id !== 'reset-form') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            errorMessage = 'Please enter a valid email address.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }

                    if (name === 'newPassword' || name === 'password') {
                        if (value.length < 6) {
                            errorMessage = 'Password must be at least 6 characters long.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                        const strengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
                        if (!strengthRegex.test(value)) {
                            errorMessage = 'Password must contain letters and numbers.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }

                    if (name === 'confirmPassword') {
                        const password = form.querySelector('input[name="newPassword"]')?.value.trim() || form.querySelector('input[name="password"]').value.trim();
                        if (value !== password) {
                            errorMessage = 'Passwords do not match.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }

                    if (name === 'age') {
                        const age = parseInt(value);
                        if (isNaN(age) || age < 1 || age > 120) {
                            errorMessage = 'Please enter a valid age (1-120).';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }

                    if (name === 'dateOfBirth') {
                        const date = new Date(value);
                        if (isNaN(date.getTime()) || date > new Date()) {
                            errorMessage = 'Please enter a valid date of birth.';
                            input.focus();
                            isValid = false;
                            return false;
                        }
                    }
                });

                selects.forEach(select => {
                    if (!select.value && select.hasAttribute('required')) {
                        errorMessage = `Please select a ${select.name}.`;
                        select.focus();
                        isValid = false;
                        return false;
                    }
                });

                if (!isValid) {
                    errorDiv.textContent = errorMessage;
                    errorDiv.classList.add('error-message');
                    form.insertBefore(errorDiv, form.querySelector('button'));
                    return;
                }

                const formData = new FormData(form);
                console.log('Form data being submitted:', Object.fromEntries(formData));

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    console.log('Server response:', result);
                    if (response.ok) {
                        if (form.id === 'login-form' || form.id === 'signup-form') {
                            const email = form.querySelector('input[name="email"]').value.trim().toLowerCase(); // Normalize email
                            console.log('Storing email in localStorage:', email);
                            localStorage.setItem('userEmail', email); // Store normalized email
                        }
                        if (form.id === 'login-form') {
                            window.location.href = '/home';
                        } else if (form.id === 'signup-form') {
                            window.location.href = '/login';
                        } else if (form.id === 'reset-form') {
                            localStorage.removeItem('userEmail'); // Clear email after reset
                            window.location.href = '/login'; // Redirect to login after password reset
                        }
                    } else {
                        console.error('Form submission failed:', result.message);
                        errorDiv.textContent = result.message;
                        errorDiv.classList.add('error-message');
                        form.insertBefore(errorDiv, form.querySelector('button'));
                    }
                } catch (error) {
                    console.error('Error during form submission:', error);
                    errorDiv.textContent = 'An error occurred. Please try again.';
                    errorDiv.classList.add('error-message');
                    form.insertBefore(errorDiv, form.querySelector('button'));
                }
            });
        }
    });

    // Profession subfield logic for edit profile form
    const editProfessionSelect = document.getElementById('edit-profession');
    const editProfessionSubfield = document.getElementById('edit-profession-subfield');
    const editStudyFieldInput = document.getElementById('edit-studyField');
    const editJobRoleInput = document.getElementById('edit-jobRole');
    const editOtherProfessionInput = document.getElementById('edit-otherProfession');

    if (editProfessionSelect && editProfessionSubfield) {
        editProfessionSelect.addEventListener('change', () => {
            editStudyFieldInput.style.display = 'none';
            editJobRoleInput.style.display = 'none';
            editOtherProfessionInput.style.display = 'none';
            editProfessionSubfield.style.display = 'none';

            if (editProfessionSelect.value === 'student') {
                editProfessionSubfield.style.display = 'block';
                editStudyFieldInput.style.display = 'block';
                editStudyFieldInput.setAttribute('required', 'true');
                editJobRoleInput.removeAttribute('required');
                editOtherProfessionInput.removeAttribute('required');
            } else if (editProfessionSelect.value === 'employee') {
                editProfessionSubfield.style.display = 'block';
                editJobRoleInput.style.display = 'block';
                editJobRoleInput.setAttribute('required', 'true');
                editStudyFieldInput.removeAttribute('required');
                editOtherProfessionInput.removeAttribute('required');
            } else if (editProfessionSelect.value === 'other') {
                editProfessionSubfield.style.display = 'block';
                editOtherProfessionInput.style.display = 'block';
                editOtherProfessionInput.setAttribute('required', 'true');
                editStudyFieldInput.removeAttribute('required');
                editJobRoleInput.removeAttribute('required');
            } else {
                editStudyFieldInput.removeAttribute('required');
                editJobRoleInput.removeAttribute('required');
                editOtherProfessionInput.removeAttribute('required');
            }
        });
    }
});
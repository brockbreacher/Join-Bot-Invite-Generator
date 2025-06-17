// Update copyright year automatically
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Cache DOM elements for better performance
const clientIdInput = document.getElementById('clientId');
const validationStatus = document.getElementById('validationStatus');
const generateBtn = document.getElementById('generateBtn');
const inviteBtn = document.getElementById('inviteBtn');
const copyBtn = document.getElementById('copyBtn');
const generatedLink = document.getElementById('generatedLink');
let currentInviteLink = '';

/**
 * Validates a Discord Client ID against Discord's API
 * @param {string} clientId - The Client ID to validate
 * @returns {Promise<{valid: boolean, message?: string}>} Validation result
 */
async function validateClientId(clientId) {
    // Basic format check (18-20 digits)
    if (!/^\d{17,20}$/.test(clientId)) {
        return { valid: false, message: "Must be 18-20 digits" };
    }

    // Show validating state
    clientIdInput.classList.add('validating');
    clientIdInput.classList.remove('valid', 'invalid');
    validationStatus.textContent = "Checking Discord API...";
    validationStatus.className = "status-text validating-text";

    try {
        // Check if application exists
        const response = await fetch(`https://discord.com/api/v10/applications/${clientId}/rpc`);

        if (response.ok) {
            // Valid application found
            clientIdInput.classList.replace('validating', 'valid');
            validationStatus.textContent = "✓ Valid Client ID";
            validationStatus.className = "status-text valid-text";
            return { valid: true };
        } else {
            throw new Error(`API returned ${response.status}`);
        }
    } catch (error) {
        // Invalid application or API error
        clientIdInput.classList.replace('validating', 'invalid');
        validationStatus.textContent = "✗ Not a valid Discord application";
        validationStatus.className = "status-text invalid-text";
        return { 
            valid: false, 
            message: "No Discord application found with this ID" 
        };
    }
}

// Real-time input validation with debounce
let validationTimeout;
clientIdInput.addEventListener('input', () => {
    clearTimeout(validationTimeout);
    const clientId = clientIdInput.value.trim();

    // Reset state if empty
    if (clientId.length === 0) {
        clientIdInput.classList.remove('validating', 'valid', 'invalid');
        validationStatus.textContent = "";
        return;
    }

    // Check for non-numeric characters
    if (!/^\d{0,20}$/.test(clientId)) {
        clientIdInput.classList.add('invalid');
        validationStatus.textContent = "Only numbers allowed";
        validationStatus.className = "status-text invalid-text";
        return;
    }

    // Only validate against API if we have enough digits
    if (clientId.length >= 17) {
        validationTimeout = setTimeout(() => validateClientId(clientId), 800);
    }
});

/**
 * Generates the proper invite link based on bot type
 */
generateBtn.addEventListener('click', async function() {
    const clientId = clientIdInput.value.trim();

    // Basic validation
    if (!clientId) {
        alert('Please enter a Client ID');
        return;
    }

    // API validation
    const validation = await validateClientId(clientId);
    if (!validation.valid) {
        alert(validation.message || "Invalid Client ID");
        return;
    }

    // Get selected bot type
    const botType = document.querySelector('input[name="botType"]:checked').value;
    let permissions, scope;

    // Set permissions based on bot type
    if (botType === 'join-bot') {
        permissions = '2147503232'; // Join-Bot permissions
    } else {
        permissions = '2415922176'; // Accept-Bot permissions (matches example)
    }

    // Generate invite URL using proper format
    currentInviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot+applications.commands`;
    generatedLink.style.display = 'block';
});

// Open invite in new window
inviteBtn.addEventListener('click', function() {
    if (currentInviteLink) {
        window.open(currentInviteLink, '_blank');
    }
});

/**
 * Handles copying the invite link with multiple fallbacks
 */
copyBtn.addEventListener('click', function() {
    if (!currentInviteLink) return;

    // Create hidden textarea for copy operation
    const textarea = document.createElement('textarea');
    textarea.value = currentInviteLink;
    textarea.classList.add('hidden-textarea');
    document.body.appendChild(textarea);

    // Select text for copying
    textarea.select();

    try {
        // Try modern Clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(currentInviteLink)
                .then(() => showCopySuccess())
                .catch(() => fallbackCopy());
        } 
        // Fallback to deprecated execCommand
        else if (document.execCommand('copy')) {
            showCopySuccess();
        } 
        // Final fallback shows textarea
        else {
            fallbackCopy();
        }
    } catch (e) {
        fallbackCopy();
    } finally {
        // Clean up DOM
        document.body.removeChild(textarea);
    }

    // Show success state
    function showCopySuccess() {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#43B581';

        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#7289DA';
        }, 2000);
    }

    // Fallback UI when copy fails
    function fallbackCopy() {
        generatedLink.innerHTML = `
            <div style="margin-top: 20px;">
                <p>Generated Invite Link:</p>
                <textarea id="manualCopy" rows="2">${currentInviteLink}</textarea>
                <div class="action-buttons">
                    <button onclick="window.open('${currentInviteLink}', '_blank')">Invite Bot</button>
                    <button onclick="location.reload()">Generate New Link</button>
                </div>
                <p>Please copy the link above manually</p>
            </div>
        `;
    }
});
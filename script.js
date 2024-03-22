// Function to update the year dynamically
function updateYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Call the function to update the year when the script loads
updateYear();

// Function to generate the invite link
document.getElementById('generateBtn').addEventListener('click', function() {
    const clientId = document.getElementById('clientId').value;
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=2147503232&scope=bot%20applications.commands`;
    document.getElementById('inviteLink').href = inviteLink;
    document.getElementById('inviteLink').textContent = inviteLink;
    document.getElementById('generatedLink').style.display = 'block'; // Ensure this line is present to show the generated link container
});

// Function to copy the invite link
document.getElementById('copyBtn').addEventListener('click', function() {
    const inviteLink = document.getElementById('inviteLink').href;
    navigator.clipboard.writeText(inviteLink).then(function() {
        alert('Link copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
});

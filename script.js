// Function to update the year dynamically
function updateYear() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Call the function to update the year when the script loads
updateYear();

// set the permissions value from the # of the url when the page laods
var hash = window.location.hash;
if (hash.length && !isNaN(hash = parseInt(hash.substr(1)))) {
    document.getElementById('permissions').value = hash;
}

// update the # of the url when the permissions input changes
document.getElementById('permissions').addEventListener('input', function() {
    var permissions = document.getElementById('permissions').value;
    if (permissions.length) {
        window.location.hash = permissions;
    } else {
        window.location.hash = '';
    }
});

// Function to generate the invite link
document.getElementById('generateBtn').addEventListener('click', function() {
    
    const clientId = document.getElementById('clientId').value;
    const permissions = document.getElementById('permissions').value;
    if (!clientId) {
        alert('please enter a Client ID');
        return;
    }
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions||0}&scope=bot%20applications.commands`;
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

let packages = [];

// Allow only alphabetical characters for Reception Name
function validateRecipientName(name) {
    return /^[A-Za-z\s]+$/.test(name);
}

// Allow only numeric characters for Package ID
function validatePackageId(id) {
    return /^\d+$/.test(id);
}

// Address cannot be empty
function validateAddress(address) {
    return address.trim().length > 0;
}

// Weight should be a positive number
function validateWeight(weight) {
    return !isNaN(weight) && parseFloat(weight) > 0;
}

// Generate tracking code by combining package ID and weight
function generateTrackingCode(packageId, weight) {
    const weightInt = Math.floor(weight * 100);
    return (packageId << 4 | weightInt).toString(2);
}

// Add package to the list
function addPackage(recipientName, packageId, address, weight) {
    if (!validateRecipientName(recipientName)) {
        throw new Error('Invalid Recipient Name. Please use alphabetic characters only.');
    }
    if (!validatePackageId(packageId)) {
        throw new Error('Invalid Package ID. Please enter numeric values only.');
    }
    if (!validateAddress(address)) {
        throw new Error('Invalid Address. Address cannot be empty.');
    }
    if (!validateWeight(weight)) {
        throw new Error('Invalid Weight. Please enter a positive number.');
    }

    const package = {
        recipientName,
        packageId,
        address,
        weight: parseFloat(weight),
        trackingCode: generateTrackingCode(packageId, weight)
    };

    packages.push(package);
    sortPackages();
    return package;
}

// Quick sort algorithm in sort method of javascript
// Quick sort is more efficient than bubble sort
function sortPackages() {
    packages.sort((a, b) => a.weight - b.weight);
}

// Update the package list in the table
function updatePackageList() {
    const tbody = document.getElementById('packageList');
    tbody.innerHTML = '';
    
    packages.forEach(package => {
        const row = tbody.insertRow();
        row.insertCell().textContent = package.recipientName;
        row.insertCell().textContent = package.packageId;
        row.insertCell().textContent = package.address;
        row.insertCell().textContent = package.weight.toFixed(1);
        row.insertCell().textContent = package.trackingCode;
    });
}

// Event listener for form submission
document.getElementById('packageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('message');

    try {
        const package = addPackage(
            document.getElementById('recipientName').value,
            document.getElementById('packageId').value,
            document.getElementById('deliveryAddress').value,
            document.getElementById('weight').value
        );

        messageDiv.textContent = `Package added successfully!\nTracking Code: ${package.trackingCode}`;
        messageDiv.className = 'message success';
        this.reset();
        updatePackageList();
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = 'message error';
    }
});
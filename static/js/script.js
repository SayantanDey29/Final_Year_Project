function predict() {
    var text = document.getElementById("comment").value;
    var pred = document.getElementById("prediction");
    pred.classList.add('box');
    pred.innerHTML = "<h2>Prediction Result</h2>";
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    })
    .then(response => response.json())
    .then(data => {
        for (const items in data) {
            var categoryElement = document.getElementById(items);
            categoryElement.classList.add('category');
            var result = data[items] * 100;
            var color = getColor(result);
            categoryElement.style.background = color;
            categoryElement.innerText = `${items.toUpperCase()}: ${result.toFixed(2)}%`;
        }
    })
    .catch(error => console.error('Error:', error));
}

function getColor(percentage) {
    // Convert percentage to a value between 0 and 1
    var normalizedValue = percentage / 100;

    // Define the colors for low, medium, and high
    var lowColor = [0, 255, 0]; // Green
    var mediumColor = [0, 0, 255]; // Blue
    var highColor = [255, 0, 0]; // Red

    var color;

    // Interpolate between the colors based on percentage
    if (normalizedValue <= 0.5) {
        // Interpolate between low and medium
        var ratio = normalizedValue / 0.5;
        color = interpolateColors(lowColor, mediumColor, ratio);
    } else {
        // Interpolate between medium and high
        var ratio = (normalizedValue - 0.5) / 0.5;
        color = interpolateColors(mediumColor, highColor, ratio);
    }

    // Calculate the alpha value based on percentage
    var alpha = normalizedValue;

    // Return the color as a CSS string with gradient and transparency
    return `linear-gradient(to right, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha}), rgba(255, 255, 255, ${alpha}))`;
}

// Function to interpolate between two colors
function interpolateColors(color1, color2, ratio) {
    var result = [];
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(color1[i] * (1 - ratio) + color2[i] * ratio);
    }
    return result;
}


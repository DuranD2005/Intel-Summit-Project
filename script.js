const form = document.getElementById("checkInForm");

const nameInput = document.getElementById("attendeeName");

const teamSelection = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;
let attendees = [];

// Reset local storage and counters
function resetLocalStorage() {
  // Clear all local storage items
  localStorage.removeItem("totalCount");
  localStorage.removeItem("waterCount");
  localStorage.removeItem("zeroCount");
  localStorage.removeItem("powerCount");
  localStorage.removeItem("attendees");

  // Reset all counters to 0
  count = 0;
  attendees = [];
  document.getElementById("attendeeCount").textContent = count;
  document.getElementById("waterCount").textContent = "0";
  document.getElementById("zeroCount").textContent = "0";
  document.getElementById("powerCount").textContent = "0";

  // Reset progress bar
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = "0%";

  // Reset greeting message
  const greeting = document.getElementById("greeting");
  greeting.textContent = "Check in to get started!";
  greeting.classList.remove("success-message");

  // Clear attendee list
  updateAttendeeList();

  console.log("Local storage and counters have been reset");
}

// Update attendee list display
function updateAttendeeList() {
  const container = document.getElementById("attendeeListContainer");
  const noAttendeesMessage = document.getElementById("noAttendeesMessage");

  if (attendees.length === 0) {
    noAttendeesMessage.style.display = "block";
    return;
  }

  noAttendeesMessage.style.display = "none";

  const attendeeHTML = attendees
    .map(function (attendee) {
      return `<div class="attendee-item ${attendee.teamValue}">
      <span class="attendee-name">${attendee.name}</span>
      <span class="attendee-team">${attendee.teamText}</span>
    </div>`;
    })
    .join("");

  container.innerHTML = `<p class="no-attendees" id="noAttendeesMessage" style="display: none;">No attendees checked in yet.</p>${attendeeHTML}`;
}

// Load saved counts from local storage when page loads
function loadSavedCounts() {
  const savedCount = localStorage.getItem("totalCount");
  const savedWaterCount = localStorage.getItem("waterCount");
  const savedZeroCount = localStorage.getItem("zeroCount");
  const savedPowerCount = localStorage.getItem("powerCount");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedCount) {
    count = parseInt(savedCount);
    document.getElementById("attendeeCount").textContent = count;

    // Update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = percentage;
  }

  if (savedWaterCount) {
    document.getElementById("waterCount").textContent = savedWaterCount;
  }

  if (savedZeroCount) {
    document.getElementById("zeroCount").textContent = savedZeroCount;
  }

  if (savedPowerCount) {
    document.getElementById("powerCount").textContent = savedPowerCount;
  }

  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
    updateAttendeeList();
  }
}

// Save counts to local storage
function saveCounts() {
  localStorage.setItem("totalCount", count.toString());
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent
  );
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Load saved counts when page loads
loadSavedCounts();

//Form Submission

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Check if we've reached maximum capacity
  if (count >= maxCount) {
    return; // Don't process any more check-ins
  }

  const teamName = teamSelection.value;
  //Team Counter

  const teamCounter = document.getElementById(teamName + "Count");

  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Form Values

  const name = nameInput.value;

  const readTeam = teamSelection.selectedOptions[0].text;

  console.log(name, readTeam);

  // Add attendee to list
  attendees.push({
    name: name,
    teamValue: teamName,
    teamText: readTeam,
  });

  // Update attendee list display
  updateAttendeeList();

  //Increase count by 1
  count++;
  console.log("Total Check-ins: ", count);

  // Update attendee count display
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  //Update progress bar

  const percentage = Math.round((count / maxCount) * 100) + "%";

  console.log(`Progress: ${percentage}`);

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  // Save updated counts to local storage
  saveCounts();

  // Check if we just reached maximum capacity and declare winner
  if (count === maxCount) {
    const waterCounter = document.getElementById("waterCount");
    const zeroCounter = document.getElementById("zeroCount");
    const powerCounter = document.getElementById("powerCount");

    const waterCount = parseInt(waterCounter.textContent);
    const zeroCount = parseInt(zeroCounter.textContent);
    const powerCount = parseInt(powerCounter.textContent);

    if (waterCount >= zeroCount && waterCount >= powerCount) {
      let teamWinner = document.getElementById("greeting");
      teamWinner.textContent = "🌊 Water Wise Surfed Out Today!!! 🌊";
      return;
    } else if (zeroCount >= waterCount && zeroCount >= powerCount) {
      let teamWinner = document.getElementById("greeting");
      teamWinner.textContent = "🌿 Net Zero Zeroeddd Out The Competition!!! 🌿";
      return;
    } else if (powerCount >= waterCount && powerCount >= zeroCount) {
      let teamWinner = document.getElementById("greeting");
      teamWinner.textContent = "⚡ Renewables Surged Out Today!!! ⚡";
      return;
    }
  }

  //Show welcome message
  const emojis = ["😎", "🎉", "⭐"];

  const message = `${
    emojis[Math.floor(Math.random() * emojis.length)]
  } Welcome ${name} from ${readTeam}!`;
  console.log(message);

  //Alert message to greet Attendees

  let greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  //Reset form when submitted
  form.reset();
});

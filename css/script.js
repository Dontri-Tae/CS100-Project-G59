const config = {
  // backendUrl: "http://54.179.42.49/", // Default backend URL
  // backendUrl: "https://d1npkyc4r380kx.cloudfront.net/", // Default backend URL
  backendUrl: "https://d1a6370uhsfk5w.cloudfront.net/", // Default backend URL
};

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    // Check if each part contains only English letters
    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(names[0]) || !nameRegex.test(names[1])) {
      errorElement.textContent = "Please enter valid Firstname and Lastname using only English letters.";
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
    }
  }

  return true;
}

/// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^66096\d{5}$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter your 10-digit student, ID starting with 66096";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(config.backendUrl + "getActivityType");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };

  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(config.backendUrl + "record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document
  .getElementById("studentID")
  .addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);

document.addEventListener('DOMContentLoaded', function () {
  // เพิ่ม event listener สำหรับการ submit ฟอร์ม
  document.getElementById('myForm').addEventListener('submit', function (event) {
    // ตรวจสอบข้อมูลที่กรอก
    var fullname = document.getElementById('fullname').value;
    var studentID = document.getElementById('studentID').value;
    var email = document.getElementById('email').value;
    var academicYear = document.getElementById('academicYear').value;
    var semester = document.getElementById('semester').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var location = document.getElementById('location').value;
    var description = document.getElementById('description').value;

    // ตรวจสอบว่ามีข้อมูลที่ไม่ถูกกรอกหรือไม่
    if (
      fullname === '' ||
      studentID === '' ||
      email === '' ||
      academicYear === '' ||
      semester === '' ||
      startDate === '' ||
      endDate === '' ||
      location === '' ||
      description === ''
    ) {
      // แสดง alert เมื่อข้อมูลไม่ครบ
      alert('Please fill out all fields.');
      // ยกเลิกการ submit ฟอร์ม
      event.preventDefault();
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Add event listener for form submission
  document.getElementById('myForm').addEventListener('submit', function (event) {
    // Validate the form data here

    // If the form data is valid, you can submit the form and then reset it
    if (validateForm()) {
      // Perform any necessary actions (e.g., submit the form to a server)

      // Reset the form
      document.getElementById('myForm').reset();

      // Prevent the default form submission behavior
      event.preventDefault();
    }
  });

  // Function to validate form data
  function validateForm() {
    // Add your validation logic here
    // Return true if the form is valid, false otherwise
    // You can also display error messages if needed

    // For now, let's assume the form is always valid
    return true;
  }
});




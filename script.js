// 👁️ Eye Toggle
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const target = document.querySelector(icon.getAttribute("toggle"));
    const type = target.getAttribute("type") === "password" ? "text" : "password";
    target.setAttribute("type", type);
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});


const profileInput = document.getElementById("profilePic");
const previewImg = document.getElementById("previewPic");

if (profileInput && previewImg) {
  profileInput.addEventListener("change", () => {
    const file = profileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  });
}


if (document.getElementById("dob")) {
  flatpickr("#dob", {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    defaultDate: "2000-01-01",
    maxDate: new Date(),
    yearSelectorType: "static",
    onChange: function(selectedDates) {
      const dobError = document.getElementById("dobError");
      const today = new Date();
      const dob = selectedDates[0];
      const age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      const day = today.getDate() - dob.getDate();

      if (age < 18 || (age === 18 && (month < 0 || (month === 0 && day < 0)))) {
        dobError.textContent = "❌ You must be at least 18 years old.";
      } else {
        dobError.textContent = "";
      }
    }
  });
}


const locationData = {
  "Uttar Pradesh": {
    "Ghazipur": ["Gahmar", "Zamania"],
    "Lucknow": ["Hazratganj", "Alambagh"]
  },
  "Maharashtra": {
    "Mumbai": ["Andheri", "Borivali"],
    "Pune": ["Shivajinagar", "Hinjewadi"]
  },
  "Delhi": {
    "Central Delhi": ["Connaught Place", "Karol Bagh"],
    "South Delhi": ["Saket", "Hauz Khas"]
  }
};

const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");
const citySelect = document.getElementById("city");

if (stateSelect && districtSelect && citySelect) {
  stateSelect.addEventListener("change", () => {
    const districts = Object.keys(locationData[stateSelect.value] || {});
    districtSelect.innerHTML = '<option value="">Select District</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    districts.forEach(dist => {
      districtSelect.innerHTML += `<option value="${dist}">${dist}</option>`;
    });
  });

  districtSelect.addEventListener("change", () => {
    const cities = locationData[stateSelect.value]?.[districtSelect.value] || [];
    citySelect.innerHTML = '<option value="">Select City</option>';
    cities.forEach(city => {
      citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
  });
}


if (window.location.pathname.includes("register.html")) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = sessionStorage.getItem("loggedIn");
  if (storedUser && isLoggedIn) {
    alert("You are already logged in. Redirecting to dashboard.");
    window.location.href = "dashboard.html";
  }
}


const form = document.getElementById("registrationForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ IF EMAIL ALREADY REGISTERED → REDIRECT TO LOGIN
    if (storedUser && storedUser.email === email) {
      alert("User with this email already exists. Please login.");
      window.location.href = "login.html";
      return;
    }

    
    const fullName = document.getElementById("fullName").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const dobError = document.getElementById("dobError").textContent;
    const gender = document.querySelector("input[name='gender']:checked")?.value;
    const address = document.getElementById("address").value.trim();
    const state = stateSelect.value;
    const district = districtSelect.value;
    const city = citySelect.value;
    const skills = [...document.querySelectorAll(".column-group input[type=checkbox]:checked")].map(i => i.value);
    const terms = document.getElementById("terms").checked;
    const profilePic = localStorage.getItem("profilePic") || "profile.png";

    if (dobError !== "") return alert("You must be 18+ to register.");
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (skills.length === 0) return alert("Please select at least one skill.");
    if (!terms) return alert("You must accept the terms.");

    const user = {
      fullName, email, password, phone, gender, dob,
      address, state, district, city, skills, profilePic
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("🎉 Registration Successful!");
    window.location.href = "login.html";
  });
}

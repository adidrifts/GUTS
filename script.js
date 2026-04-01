import { db, addDoc, collection } from "./firebase.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hide");
  }, 1200);
});

const planButtons = document.querySelectorAll(".plan-select");
const planSelect = document.getElementById("plan");
const paymentGateway = document.getElementById("paymentGateway");
const selectedPlanName = document.getElementById("selectedPlanName");
const selectedPlanPrice = document.getElementById("selectedPlanPrice");
const selectedPlanDetails = document.getElementById("selectedPlanDetails");
const paymentDescription = document.getElementById("paymentDescription");
const qrCodeImage = document.getElementById("qrCodeImage");
const payBtn = document.getElementById("payBtn");

const planPricing = {
  Basic: 999,
  Standard: 1499,
  Premium: 2499,
};

document.getElementById("gymForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const plan = document.getElementById("plan").value;
  const msg = document.getElementById("msg");

  if (!plan) {
    msg.innerText = "Please select a membership plan first.";
    msg.style.color = "#ff6b6b";
    return;
  }

  if (paymentGateway.classList.contains("hidden")) {
    updatePaymentPanel(plan);
    msg.innerText = `Payment QR code generated for ₹${planPricing[plan]}. Scan or tap to pay with UPI.`;
    msg.style.color = "#d4af37";
    return;
  }

  if (!name || /\d/.test(name)) {
    msg.innerText = "Please enter a valid name.";
    msg.style.color = "#ff6b6b";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    msg.innerText = "Please enter a valid email.";
    msg.style.color = "#ff6b6b";
    return;
  }

  if (!age || age < 15) {
    msg.innerText = "Age must be 15 or above.";
    msg.style.color = "#ff6b6b";
    return;
  }

  try {
    await addDoc(collection(db, "members"), {
      name: name,
      email: email,
      age: age,
      plan: plan,
      joinedAt: new Date().toLocaleString()
    });

    msg.innerText = "Successfully joined GUTS GYM!";
    msg.style.color = "#d4af37";
    document.getElementById("gymForm").reset();
    paymentGateway.classList.add("hidden");
  } catch (error) {
    msg.innerText = "Error: " + error.message;
    msg.style.color = "#ff6b6b";
    console.log(error);
  }
});

window.calculateBMI = function () {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const bmiResult = document.getElementById("bmiResult");

  if (!height || !weight) {
    bmiResult.innerText = "Please enter height and weight.";
    bmiResult.style.color = "#ff6b6b";
    return;
  }

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

  let status = "";

  if (bmi < 18.5) {
    status = "Underweight";
  } else if (bmi < 24.9) {
    status = "Normal";
  } else if (bmi < 29.9) {
    status = "Overweight";
  } else {
    status = "Obese";
  }

  bmiResult.innerText = `Your BMI is ${bmi} (${status})`;
  bmiResult.style.color = "#d4af37";
};

window.calculateBodyFat = function () {
  const gender = document.getElementById("gender").value;
  const age = parseFloat(document.getElementById("ageCalc").value);
  const waist = parseFloat(document.getElementById("waist").value);
  const fatResult = document.getElementById("fatResult");

  if (!gender || !age || !waist) {
    fatResult.innerText = "Please fill all body fat fields.";
    fatResult.style.color = "#ff6b6b";
    return;
  }

  let bodyFat;

  if (gender === "male") {
    bodyFat = waist * 0.74 - (22 + age * 0.12);
  } else {
    bodyFat = waist * 0.74 - (18 + age * 0.1);
  }

  if (bodyFat < 5) bodyFat = 5;

  fatResult.innerText = `Estimated body fat: ${bodyFat.toFixed(1)}%`;
  fatResult.style.color = "#d4af37";
};

// Fade-in animation
const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.18 }
);

faders.forEach((el) => observer.observe(el));

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(10,10,10,0.95)";
  } else {
    navbar.style.background = "rgba(5,5,5,0.88)";
  }
});

// Scroll progress bar
window.addEventListener("scroll", () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
});

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// FAQ accordion
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.style.maxHeight;

    document.querySelectorAll(".faq-answer").forEach((item) => {
      item.style.maxHeight = null;
    });

    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// Plan auto-select and payment gateway
function preparePaymentValues(plan) {  if (!plan || !planPricing[plan]) {
    return;
  }

  const price = planPricing[plan];
  const upiPayload = `upi://pay?pa=gutsgym@paytm&pn=GUTS%20GYM&tn=${encodeURIComponent(
    plan + "%20Membership"
  )}&am=${price}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiPayload
  )}`;

  selectedPlanName.innerText = `${plan} Plan`;
  selectedPlanPrice.innerText = `₹${price}`;
  selectedPlanDetails.innerText = `Scan the QR code or tap the button below to open your UPI app and complete payment.`;
  paymentDescription.innerText = `Complete payment for the ${plan} membership and then submit your details in the join form.`;
  qrCodeImage.src = qrUrl;
  payBtn.href = upiPayload;
  payBtn.innerText = "Pay with UPI";
}

function updatePaymentPanel(plan) {
  preparePaymentValues(plan);
  if (!plan || !planPricing[plan]) {
    paymentGateway.classList.add("hidden");
    return;
  }

  paymentGateway.classList.remove("hidden");
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPlan = button.getAttribute("data-plan");
    planSelect.value = selectedPlan;
    updatePaymentPanel(selectedPlan);
    document.getElementById("join").scrollIntoView({ behavior: "smooth" });
  });
});

planSelect.addEventListener("change", () => {
  updatePaymentPanel(planSelect.value);
});

// Animated counters
const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function runCounters() {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const increment = Math.ceil(target / 80);

    const updateCounter = () => {
      count += increment;
      if (count > target) count = target;
      counter.innerText = count + "+";

      if (count < target) {
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
}

const statsSection = document.querySelector(".stats-section");

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !counterStarted) {
      counterStarted = true;
      runCounters();
    }
  });
}, { threshold: 0.4 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

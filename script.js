// Smooth scroll to contact
function scrollToContact() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  }
  
  // Form validation
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const formMessage = document.getElementById("formMessage");
  
    if (name && email && message) {
      formMessage.textContent = "✅ Message sent successfully!";
      this.reset();
    } else {
      formMessage.textContent = "⚠️ Please fill in all fields.";
      formMessage.style.color = "red";
    }
  });
  
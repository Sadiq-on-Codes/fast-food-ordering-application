<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Contact Us</h3>
        <p>📞 0501230274</p>
        <p>📧 smoothietwist19@gmail.com</p>
      </div>
      <div class="footer-section">
        <h3>Hours</h3>
        <p>Mon-Fri: 10am - 10pm</p>
        <p>Sat-Sun: 12pm - 11pm</p>
      </div>
      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="social-links">
          <a href="#" class="social-link">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 VeriPas Inc. All rights reserved.</p>
      <p>Designed and Developed by <a href="https://www.linkedin.com/in/abubakar-sadick-y-57a858b0/" target="_blank" class="developer-link">Abubakar Sadick Yahaya</a></p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 2rem 1rem;
  margin-top: auto;
}

.footer-content {
  width: 80%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-section h3 {
  color: #8e44ad;
  margin-bottom: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #ecf0f1;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #8e44ad;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
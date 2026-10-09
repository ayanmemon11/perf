/**
 * ==============================================================================
 * PERFECT COMPUTER EDUCATION - CENTRAL CONFIGURATION FILE
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR EDITING:
 * You can easily update your institute's contact numbers, address, email,
 * WhatsApp number, and social media handles right here.
 * The website will automatically update everywhere!
 */

const INSTITUTE_CONFIG = {
  // Brand Information
  instituteName: "Perfect Computer Education",
  tagline: "Learn Today • Grow Tomorrow",
  establishedYear: "2019",
  
  // Primary Contact Details (CHANGE HERE)
  phone: "+91 98765 43210",              // Replace with your primary phone number
  altPhone: "+91 98765 43211",           // Replace with alternate phone number (optional)
  phoneLink: "+919876543210",            // Format for tel: links (numbers only with country code)
  
  // WhatsApp Configuration (CHANGE HERE)
  whatsappNumber: "919876543210",        // Replace with your WhatsApp number (include country code without +)
  whatsappDefaultMsg: "Hello Perfect Computer Education, I would like to know more about your courses and admission process.",
  
  // Email & Communication
  email: "info@perfectcomputereducation.com",
  admissionEmail: "admissions@perfectcomputereducation.com",
  
  // Physical Location & Timings (CHANGE HERE)
  address: {
    line1: "2nd Floor, Perfect Commercial Complex,",
    line2: "Opp. City Central Mall, Station Road,",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    fullAddress: "2nd Floor, Perfect Commercial Complex, Opp. City Central Mall, Station Road, Ahmedabad, Gujarat - 380001"
  },
  
  // Working Hours
  openingHours: {
    weekdays: "Monday - Saturday: 8:00 AM – 8:00 PM",
    sunday: "Sunday: 9:00 AM – 1:00 PM (Enquiry & Special Batches)"
  },
  
  // Google Maps Embed URL
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117496.48281313797!2d72.47959048386478!3d23.02700346083547!2m3!1f0!2f0!3f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",

  // Social Media Links
  socialLinks: {
    instagram: "https://instagram.com/perfectcomputereducation",
    facebook: "https://facebook.com/perfectcomputereducation",
    youtube: "https://youtube.com/@perfectcomputereducation",
    whatsapp: "https://wa.me/919876543210"
  },

  // Key Statistics (Animated Counters)
  statistics: {
    studentsTrained: 1000,
    professionalCourses: 10,
    yearsOfExcellence: 5,
    practicalLearning: 100
  }
};

// Export configuration to window object
if (typeof window !== "undefined") {
  window.INSTITUTE_CONFIG = INSTITUTE_CONFIG;
}

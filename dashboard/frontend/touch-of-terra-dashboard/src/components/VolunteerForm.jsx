import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function VolunteerForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: 'weekdays',
    skills: '',
    heardFrom: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${API_URL}/api/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          availability: 'weekdays',
          skills: '',
          heardFrom: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      setSubmitError('Failed to submit. Please try again or email us directly at touchofterralouisville@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-tot-teal to-tot-green-primary p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Volunteer Signup</h2>
                <p className="text-white/90 text-sm">Join us in making a difference</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900">Thank you for signing up!</h3>
                <p className="text-sm text-green-700">We'll be in touch soon with volunteer opportunities.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-tot-text-dark mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-tot-text-dark mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-tot-text-dark mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all"
                placeholder="(502) 555-1234"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-tot-text-dark mb-2">
                Availability *
              </label>
              <select
                name="availability"
                required
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all bg-white"
              >
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="both">Both</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Skills/Interests */}
          <div>
            <label className="block text-sm font-semibold text-tot-text-dark mb-2">
              Skills or Areas of Interest
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all"
              placeholder="e.g., Medical, Food Service, Tech, Admin, Direct Outreach"
            />
          </div>

          {/* How did you hear */}
          <div>
            <label className="block text-sm font-semibold text-tot-text-dark mb-2">
              How did you hear about us?
            </label>
            <select
              name="heardFrom"
              value={formData.heardFrom}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all bg-white"
            >
              <option value="">Select an option</option>
              <option value="social-media">Social Media</option>
              <option value="friend">Friend/Family</option>
              <option value="news">News/Media</option>
              <option value="nonprofit">Another Nonprofit</option>
              <option value="website">Touch of Terra Website</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-tot-text-dark mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-tot-green-sage/20 rounded-xl focus:border-tot-green-primary focus:ring-2 focus:ring-tot-green-primary/20 outline-none transition-all resize-none"
              placeholder="Tell us more about why you want to volunteer or what you'd like to help with..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-4 rounded-xl font-semibold text-white shadow-tot-medium hover:shadow-tot-large transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-tot-text-light cursor-not-allowed'
                  : 'bg-gradient-to-r from-tot-teal to-tot-green-primary hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Volunteer Application
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 rounded-xl font-semibold text-tot-text-dark border-2 border-tot-green-sage/20 hover:border-tot-green-primary transition-all"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-tot-text-light text-center">
            By submitting, you agree to be contacted by Touch of Terra regarding volunteer opportunities.
          </p>
        </form>
      </div>
    </div>
  );
}

export default VolunteerForm;

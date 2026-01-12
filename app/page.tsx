"use client";
import { useState, ChangeEvent, MouseEvent } from "react";
import { Loader, Check, AlertCircle, Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  spam_detection: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  spam_detection?: string;
}

interface FormTouched {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
  spam_detection?: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";
type FormField = keyof FormData;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    spam_detection: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const validateField = (name: FormField, value: string): string => {
    switch (name) {
      case "name":
        return value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email"
          : "";
      case "subject":
        return value.trim().length < 3
          ? "Subject must be at least 3 characters"
          : "";
      case "message":
        return value.trim().length < 10
          ? "Message must be at least 10 characters"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    const fieldName = name as FormField;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    const fieldName = name as FormField;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as FormField[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(newErrors).length > 0) return;

    setStatus("loading");

    try {
      // Simulated API call - replace with your actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Uncomment and use your actual API call:
      const response = await fetch("/api/contactform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send");

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", subject: "", message: "" , spam_detection : ""});
        setTouched({});
        setErrors({});
      }, 4000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg">
            We'd love to hear from you. Fill out the form below and we'll
            respond within 24 hours.
          </p>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold">
                Message sent successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                We@&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold">
                Failed to send message
              </p>
              <p className="text-red-700 text-sm mt-1">
                Please try again or contact us directly.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === "loading"}
              className={`w-full px-4 py-3 border ${
                errors.name && touched.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg focus:ring-2 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="John Doe"
              aria-invalid={errors.name && touched.name ? "true" : "false"}
              aria-describedby={
                errors.name && touched.name ? "name-error" : undefined
              }
            />
            {errors.name && touched.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === "loading"}
              className={`w-full px-4 py-3 border ${
                errors.email && touched.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg focus:ring-2 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="john@example.com"
              aria-invalid={errors.email && touched.email ? "true" : "false"}
              aria-describedby={
                errors.email && touched.email ? "email-error" : undefined
              }
            />
            {errors.email && touched.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === "loading"}
              className={`w-full px-4 py-3 border ${
                errors.subject && touched.subject
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg focus:ring-2 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="How can we help you?"
              aria-invalid={
                errors.subject && touched.subject ? "true" : "false"
              }
              aria-describedby={
                errors.subject && touched.subject ? "subject-error" : undefined
              }
            />
            {errors.subject && touched.subject && (
              <p
                id="subject-error"
                className="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Honeypot Field - Hidden from humans, trap for bots */}
          <div
            className="opacity-0 absolute -z-10"
            style={{ height: 0, width: 0, overflow: "hidden" }}
            aria-hidden="true"
          >
            <label htmlFor="spam_detection">Leave this field empty</label>
            <input
              type="text"
              id="spam_detection"
              name="spam_detection"
              value={formData.spam_detection}
              onChange={handleChange}
              tabIndex={-1} // Prevents users from tabbing into it
              autoComplete="off" // Prevents browser autofill from triggering the trap
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === "loading"}
              rows={5}
              className={`w-full px-4 py-3 border ${
                errors.message && touched.message
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } rounded-lg focus:ring-2 focus:border-transparent transition duration-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="Tell us more about your inquiry..."
              aria-invalid={
                errors.message && touched.message ? "true" : "false"
              }
              aria-describedby={
                errors.message && touched.message ? "message-error" : undefined
              }
            ></textarea>
            {errors.message && touched.message && (
              <p
                id="message-error"
                className="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.message.length} / 10 minimum characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {status === "loading" ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          * All fields are required
        </p>
      </div>
    </div>
  );
}

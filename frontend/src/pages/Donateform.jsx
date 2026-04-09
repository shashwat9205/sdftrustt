import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../config";
import QRCode from "react-qr-code";

export default function DonationForm() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    donation_amount: "",
    address: "",
    message: "",
    wants_80g: false,
    pan_number: "",
  };

  const RESET_DELAY = 3000;

  const [showPan, setShowPan] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [responseMsg, setResponseMsg] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);

  const resetRef = useRef(null);

  const CREATE_DONATION_API = `${API_BASE_URL}/create-donation.php`;

  // ✅ Razorpay Script Load
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);

  const resetToForm = () => {
    setFormData(initialFormData);
    setSavedData(null);
    setShowPayment(false);
    setShowPan(false);
    setPaymentSuccess(false);
    setTransactionId("");
    setResponseMsg("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "pan_number"
            ? value.toUpperCase()
            : value,
    }));

    if (name === "wants_80g") {
      setShowPan(checked);

      if (!checked) {
        setFormData((prev) => ({
          ...prev,
          wants_80g: false,
          pan_number: "",
        }));
      }
    }
  };

  // ✅🔥 UPDATED Razorpay Function (ONLY CHANGE HERE)
  const openRazorpay = (txnId, amount) => {
  const options = {
    key: "rzp_test_SatDp8kEpcJUJn",
    amount: Number(amount) * 100,
    currency: "INR",
    name: "SDF Trust",
    description: "Donation Payment",

    handler: function (response) {
      setPaymentSuccess(true);
      setResponseMsg("Successful payment");
      setTransactionId(txnId);

      setTimeout(() => {
        resetToForm();
      }, 3000);
    },

    prefill: {
      name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      contact: formData.phone,
    },

    theme: {
      color: "#facc15",
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  const handleSaveInformation = async (e) => {
    e.preventDefault();
    setResponseMsg("");

    if (!validateEmail(formData.email)) {
      setResponseMsg("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setResponseMsg("Please enter a valid phone number.");
      return;
    }

    if (!formData.donation_amount || Number(formData.donation_amount) <= 0) {
      setResponseMsg("Please enter a valid donation amount.");
      return;
    }

    if (formData.wants_80g && !validatePAN(formData.pan_number)) {
      setResponseMsg("Please enter a valid PAN number.");
      return;
    }

    try {
      setIsCreatingDonation(true);

      const res = await fetch(CREATE_DONATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSavedData(formData);
        setTransactionId(data.transaction_id);
        setShowPayment(true);
        setPaymentSuccess(false);

        // 🔥 Razorpay open
        openRazorpay(data.transaction_id, formData.donation_amount);
      } else {
        setResponseMsg(data.message || "Unable to start payment.");
      }
    } catch (error) {
      setResponseMsg("Something went wrong while starting payment.");
    } finally {
      setIsCreatingDonation(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2">
        Empower Children Through Music, Education, And Dignity
      </h2>

      <p className="text-gray-500 mb-6">
        Empowering underprivileged children through music, education, and
        cultural care.
      </p>

      {responseMsg && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <p>{responseMsg}</p>
        </div>
      )}

      {/* ✅ FORM SAME AS IT IS */}
      <form className="space-y-4" onSubmit={handleSaveInformation}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full border rounded-lg px-4 py-3"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="w-full border rounded-lg px-4 py-3"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Number"
            className="w-full border rounded-lg px-4 py-3"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="number"
          name="donation_amount"
          placeholder="Donation Amount"
          className="w-full border rounded-lg px-4 py-3"
          value={formData.donation_amount}
          onChange={handleChange}
          required
          min="1"
        />

        <div className="flex flex-wrap gap-3">
          {[100, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  donation_amount: String(amount),
                }))
              }
              className="px-4 py-2 rounded-full border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-sm font-medium"
            >
              ₹{amount}
            </button>
          ))}
        </div>

        <input
          type="text"
          name="address"
          placeholder="Your Address"
          className="w-full border rounded-lg px-4 py-3"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Your message..."
          className="w-full border rounded-lg px-4 py-3 h-32 resize-none"
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="wants_80g"
            checked={formData.wants_80g}
            onChange={handleChange}
          />
          <label>Check here if you want 80G Tax Redemption</label>
        </div>

        {showPan && (
          <input
            type="text"
            name="pan_number"
            placeholder="Your PAN Number"
            maxLength={10}
            className="w-full border rounded-lg px-4 py-3"
            value={formData.pan_number}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          disabled={isCreatingDonation}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-full transition disabled:opacity-50"
        >
          {isCreatingDonation ? "Please wait..." : "Donate Now →"}
        </button>
      </form>
    </div>
  );
}
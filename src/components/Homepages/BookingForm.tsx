import React, { Dispatch, SetStateAction, useState } from "react";
import { BookingForm } from "../../types/form";
import { toast } from "react-toastify";
import { Item } from "../../types/items";
import { bookItem } from "../../API/guestAPI";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const getMaxDate = (): string => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  return formatDate(maxDate);
};

const getTodayDate = (): string => {
  return formatDate(new Date());
};

export default function UserBookingForm({
  selectedItem,
  setIsSendingEmail,
}: {
  selectedItem: Item;
  setIsSendingEmail: Dispatch<SetStateAction<boolean>>;
}) {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    username: "",
    email: "",
    phone: "",
    message: null,
    bookingDate: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    bookingDate: "",
    phone: "",
    message: "",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    //  validation 
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      maxDate.setHours(23, 59, 59, 999);

      if (selectedDate < today) {
        setErrors((prev) => ({
          ...prev,
          bookingDate: "Cannot select a past date",
        }));
        return;
      }
      if (selectedDate > maxDate) {
        setErrors((prev) => ({
          ...prev,
          bookingDate: "Cannot select a date more than 7 days ahead",
        }));
        return;
      }
    }

    setBookingForm((prev) => ({
      ...prev,
      bookingDate: selectedDate,
    }));
    setErrors((prev) => ({ ...prev, bookingDate: "" }));
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBookingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (!bookingForm.username.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!bookingForm.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!bookingForm.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    }

    // Validate date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    maxDate.setHours(23, 59, 59, 999);

    if (!bookingForm.bookingDate) {
      newErrors.bookingDate = "Viewing date is required";
      isValid = false;
    } else if (bookingForm.bookingDate < today) {
      newErrors.bookingDate = "Cannot select a past date";
      isValid = false;
    } else if (bookingForm.bookingDate > maxDate) {
      newErrors.bookingDate = "Cannot select a date more than 7 days ahead";
      isValid = false;
    }

    if (bookingForm.message && bookingForm.message.length > 500) {
      newErrors.message = "Message is too long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsSendingEmail(true);

        const formData = {
          username: bookingForm.username,
          email: bookingForm.email,
          phone: bookingForm.phone,
          bookingDate: bookingForm.bookingDate,
          message: bookingForm.message,
        };

        const bookingRequest = {
          formData: formData,
          item: selectedItem,
        };

        await bookItem(bookingRequest);
        toast.success("Booking request sent successfully");

        const modal = document.getElementById(
          "my_modal_4"
        ) as HTMLDialogElement;
        if (modal) modal.close();

        setBookingForm({
          username: "",
          email: "",
          phone: "",
          message: null,
          bookingDate: null,
        });
      } catch (error: any) {
        return toast.error(error.response.data.message);
      } finally {
        setIsSendingEmail(false);
      }
    }
  };
  return (
    <>
      <div className="w-full p-4  lg:p-16 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Contact Seller
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Viewing Date (7 days from today)
            </label>
            <input
              type="date"
              min={getTodayDate()}
              max={getMaxDate()}
              value={
                bookingForm.bookingDate
                  ? bookingForm.bookingDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
              className={`
                   w-full px-4 py-2.5 
                   border ${
                     errors.bookingDate ? "border-red-500" : "border-gray-300"
                   } 
                   rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   transition duration-200 
                   bg-gray-50 hover:bg-gray-100
                    cursor-pointer
                    appearance-none 
                         [&::-webkit-calendar-picker-indicator]:bg-gray-400  
                         [&::-webkit-calendar-picker-indicator]:hover:bg-gray-500
                               [&::-webkit-calendar-picker-indicator]:p-1
                         [&::-webkit-calendar-picker-indicator]:cursor-pointer
                          [&::-webkit-calendar-picker-indicator]:rounded-lg
                        `}
            />
            {errors.bookingDate && (
              <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>
            )}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <input
                name="username"
                value={bookingForm.username}
                onChange={handleOnChange}
                type="text"
                placeholder="name"
                className={`w-full px-4 py-2.5 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-gray-100 placeholder-gray-400`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                name="email"
                value={bookingForm.email}
                onChange={handleOnChange}
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-2.5 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-gray-100 placeholder-gray-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                name="phone"
                value={bookingForm.phone}
                onChange={handleOnChange}
                type="text"
                placeholder="phone number"
                className={`w-full px-4 py-2.5 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-gray-100 placeholder-gray-400`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <textarea
              name="message"
              value={bookingForm.message || ""}
              onChange={handleOnChange}
              placeholder="Message"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-gray-100 placeholder-gray-400 resize-none`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 cursor-pointer bg-black text-white rounded-lg hover:scale-105 transition duration-200 font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
            >
              Book
            </button>
            <p className="text-error font-light!">
              ** only mocking for sending email, able to test **
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

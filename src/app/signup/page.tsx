"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import Home from "@/components/icons/home";
import { businessCategories } from "@/lib/constants";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import CountryDrop from "@/components/globals/countrydropdown";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Meteors from "@/components/magicui/meteors";
import Loader from "@/components/ui/loader";
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { getData as getCountryData } from 'country-list';
import Flag from "react-world-flags";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Country {
  code: CountryCode;
  name: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    whatsappNo: "",
  });
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);
  const [organization, setOrganization] = useState<{
    companyName: string;
    industry: string;
    teamSize: string;
    description: string;
    categories: string[];
    country: string; // Added country field
  }>({
    companyName: "",
    industry: "",
    teamSize: "",
    description: "",
    categories: [],
    country: "IN", // Initialize country
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
    description: "",
    whatsappNo: "",
  });
  const [focusedInput, setFocusedInput] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    companyName: false,
    description: false,
    whatsappNo: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [countryCode, setCountryCode] = useState('+91'); // Default country code for India
  const [selectedCountry, setSelectedCountry] = useState(organization?.country || "IN");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);


  useEffect(() => {
    const countryList = getCountryData()
      .map(country => ({
        code: country.code as CountryCode,
        name: country.name,
      }))
      .filter(country => {
        try {
          return getCountryCallingCode(country.code);
        } catch {
          return false;
        }
      });
    setCountries(countryList);
  }, []);

  // Handle category selection
  const handlenOnCategorySelect = (category: string) => {
    if (organization.categories.includes(category)) {
      setOrganization({
        ...organization,
        categories: organization.categories.filter((c) => c !== category),
      });
    } else {
      setOrganization({
        ...organization,
        categories: [...organization.categories, category],
      });
    }
  };

  // Toggle show/hide password
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleCountryChange = (code: CountryCode) => {
    const phoneCode = getCountryCallingCode(code);
    setCountryCode(`+${phoneCode}`);
    setSelectedCountry(code);
    setOrganization(prevOrg => ({
      ...prevOrg,
      country: code,
    }));
    setIsDropdownOpen(false);
  };




  const onSignup = async () => {
    try {
      setLoading(true);
      if (!showOrganizationForm && user.firstName &&
        user.lastName &&
        user.email &&
        user.whatsappNo &&
        user.password &&
        user.confirmPassword &&
        organization.country && user.password === user.confirmPassword) {
        setShowOrganizationForm(true);
      } else {
        if (!validateInputs()) return;
        const response = await axios.post("/api/users/signup", { ...user, ...organization });
        if (response.status === 200) {
          toast(<div className=" w-full mb-6 gap-2 m-auto  ">
            <div className="w-full flex  justify-center">
              <DotLottieReact
                src="/lottie/tick.lottie"
                loop
                autoplay
              />
            </div>
            <h1 className="text-black text-center font-medium text-lg">Signup successful! Redirecting to the Dashboard</h1>
          </div>);
          router.push("/dashboard"); // Redirect to dashboard
        }
      }
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error.includes("email")
      ) {
        setEmailError(error.response.data.error);
        toast.error("This Email is already registered");
      } else {
        toast.error("Signup failed, Please Fill out all Fields ");
      }
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onSignup();
    }
  };


  const validateInputs = () => {
    const newErrors = { email: "", password: "", confirmPassword: "", firstName: "", lastName: "", companyName: "", description: "", whatsappNo: "" };
    let isValid = true;

    if (!user.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!user.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!user.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!user.whatsappNo) {
      newErrors.whatsappNo = "WhatsApp Number is required";
      isValid = false;
    } else if (user.whatsappNo.length < 10) {
      newErrors.password = "Invalid WhatsApp Number";
      isValid = false;
    }

    if (showOrganizationForm) {
      if (!organization.companyName) {
        newErrors.companyName = "Company name is required";
        isValid = false;
      }
      if (!organization.description) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleInputChange = (field: string, value: string, isOrganization = false) => {
    if (isOrganization) {
      setOrganization((prev) => ({ ...prev, [field]: value }));
    } else {
      setUser((prev) => ({ ...prev, [field]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };


  return (
    <>
      <div

        className="relative flex bg-[#04071F] items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
        <div className="z-10 bg-[#04071F]">
          <Meteors number={30} />
        </div>
        {/* <Toaster /> */} {/* Sonner toaster for notifications */}
        <div
          onKeyDown={handleKeyDown} // Listen for keydown events here
          tabIndex={0} // Ensure the div is focusable for key events
          className="max-w-md w-full mt-4 z-[100] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          {showOrganizationForm ? (
            <ArrowLeft
              onClick={() => setShowOrganizationForm(false)}
              className="cursor-pointer border rounded-full border-white h-7 hover:bg-white hover:text-black w-7"
            />
          ) : (
            <h1></h1>
          )}
          <div className="flex justify-center">
            <img src="/logo.png" className="h-7" alt="Logo" />
          </div>
          <p className="text-neutral-600 text-sm font-bold text-center max-w-sm mt-2 dark:text-neutral-300">
            Let’s get started by filling up the form below
          </p>
          {showOrganizationForm ? (
            <div className="my-8">
              {/* Organization Form */}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer className="relative">

                  <label
                    htmlFor="companyName"
                    className={cn(
                      "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                      focusedInput.companyName || organization.companyName ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                    )}
                  >
                    Company Name
                  </label>

                  <input
                    id="companyName"
                    value={organization.companyName}
                    onFocus={() => setFocusedInput({ ...focusedInput, companyName: true })}
                    onBlur={() => setFocusedInput({ ...focusedInput, companyName: false })}
                    onChange={(e) => handleInputChange("companyName", e.target.value, true)}
                    className={cn(errors.companyName ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <select
                  id="industry"
                  value={organization.industry}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      industry: e.target.value,
                    })
                  }
                  className="input py-3  px-2 bg-black text-white text-sm outline-none rounded-md border"
                >
                  <option value="" className=" text-[#787CA5]" disabled>
                    Select Industry
                  </option>
                  <option value="Retail/E-Commerce">Retail/E-Commerce</option>
                  <option value="Technology">Technology</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Healthcare(Doctors/Clinics/Physicians/Hospital)">
                    Healthcare(Doctors/Clinics/Physicians/Hospital)
                  </option>
                  <option value="Logistics">Logistics</option>
                  <option value="Financial Consultants">
                    Financial Consultants
                  </option>
                  <option value="Trading">Trading</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Real Estate/Construction/Interior/Architects">
                    Real Estate/Construction/Interior/Architects
                  </option>
                  <option value="Other">Other</option>
                </select>
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <select
                  id="teamSize"
                  value={organization.teamSize}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      teamSize: e.target.value,
                    })
                  }
                  className="input py-3 px-2 border  bg-black outline-none rounded-md text-sm"
                >
                  <option value="" className="text-[#787CA5]" disabled>
                    Select Team Size
                  </option>
                  <option value="1-10">1-10</option>
                  <option value="11-20">11-20</option>
                  <option value="21-30">21-30</option>
                  <option value="31-50">31-50</option>
                  <option value="51+">51+</option>
                </select>
              </LabelInputContainer>
              <LabelInputContainer className="relative mb-4">

                <label
                  htmlFor="description"
                  className={cn(
                    "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                    focusedInput.description || organization.description ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                  )}
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={organization.description}
                  onFocus={() => setFocusedInput({ ...focusedInput, description: true })}
                  onBlur={() => setFocusedInput({ ...focusedInput, description: false })}
                  onChange={(e) => handleInputChange("description", e.target.value, true)}
                  className={cn(errors.description ? "border-red-500" : "", "border p-2 h-24 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="categories">
                  Select the categories that are relevant to your business
                </Label>
                <div className="grid grid-cols-4 pt-2 flex-row gap-2">
                  {businessCategories.map((category) => (
                    <span
                      onClick={() => handlenOnCategorySelect(category)}
                      key={category}
                      className={`px-1 text-sm py-1 text-center text-white font-medium cursor-pointer rounded-xl bg-[#] border ${organization.categories.includes(category)
                        ? "bg-[#815BF5] text-white"
                        : "text-gray-600"
                        }`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <span className="text-sm pt-5">
                  Don&apos;t worry, you can add and change these categories
                  later
                </span>
              </LabelInputContainer>

              {/* Country Dropdown
              <LabelInputContainer className="mb-8">
                <CountryDrop
                  selectedCountry={organization.country}
                  onCountrySelect={handleCountrySelect}
                />
              </LabelInputContainer> */}

              <button
                className="bg-[#815bf5] p-2 w-full border rounded-lg hover:bg-[#5f31e9]"
                type="button"
                onClick={onSignup}
                disabled={loading}
              >
                {loading
                  ? <Loader />
                  : showOrganizationForm
                    ? "Sign up "
                    : "Sign up "}
                <BottomGradient />
              </button>
              <div className="p-4 flex justify-center">
                <Link
                  href="/login"
                  className="text-center hover:underline mt-2"
                >
                  Already a{" "}
                  <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent font-bold">
                    Zapllonian
                  </span>
                  ? Login Here
                </Link>
              </div>
              <p className="text-xs text-center">
                By clicking continue, you agree to our{" "}
                <a href="/terms" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacypolicy" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

              <div className="flex justify-center gap-2">
                <div className="mt-[6px] scale-125">
                  <Home selected />
                </div>
                <Link href="/">
                  <h1 className="hover:underline cursor-pointer">
                    Back to Home
                  </h1>
                </Link>
              </div>
            </div>
          ) : (
            <div className="my-8">
              {/* User Signup Form */}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer className="relative">
                  <label
                    htmlFor="firstName"
                    className={cn(
                      "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                      focusedInput.firstName || user.firstName ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                    )}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={cn(errors.firstName ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                    value={user.firstName}
                    onFocus={() => setFocusedInput({ ...focusedInput, firstName: true })}
                    onBlur={() => setFocusedInput({ ...focusedInput, firstName: false })}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </LabelInputContainer>
                <LabelInputContainer className="relative">
                  <label
                    htmlFor="lastName"
                    className={cn(
                      "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                      focusedInput.lastName || user.lastName ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                    )}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={cn(errors.lastName ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                    value={user.lastName}
                    onFocus={() => setFocusedInput({ ...focusedInput, lastName: true })}
                    onBlur={() => setFocusedInput({ ...focusedInput, lastName: false })}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4 relative">
                <label
                  htmlFor="email"
                  className={cn(
                    "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                    focusedInput.email || user.email ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                  )}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  className={cn(errors.email ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                  value={user.email}
                  onFocus={() => setFocusedInput({ ...focusedInput, email: true })}
                  onBlur={() => setFocusedInput({ ...focusedInput, email: false })}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer className="relative mb-4">
                <label
                  htmlFor="password"
                  className={cn(
                    "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                    focusedInput.password || user.password ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                  )}
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={cn(errors.password ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                  value={user.password}
                  onFocus={() => setFocusedInput({ ...focusedInput, password: true })}
                  onBlur={() => setFocusedInput({ ...focusedInput, password: false })}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                // placeholder="••••••••"
                />

                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye className=" text-[#D4D4D4]" size={18} /> : <EyeOff className="  text-[#D4D4D4]" size={18} />}
                </div>
              </LabelInputContainer>
              <LabelInputContainer className="relative mb-4">
                <label
                  htmlFor="confirmPassword"
                  className={cn(
                    "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                    focusedInput.confirmPassword || user.confirmPassword ? "top-[-2px]  px-1 scale-90" : "top-5 left-2"
                  )}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={cn(errors.confirmPassword ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                  value={user.confirmPassword}
                  onFocus={() => setFocusedInput({ ...focusedInput, confirmPassword: true })}
                  onBlur={() => setFocusedInput({ ...focusedInput, confirmPassword: false })}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                // placeholder="••••••••"
                />

                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <Eye size={18} className=" text-[#D4D4D4]" />
                  ) : (
                    <EyeOff size={18} className=" text-[#D4D4D4]" />
                  )}
                </div>
              </LabelInputContainer>
              <div className="flex  relative mb-2">
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full  items-center cursor-pointer bg-[#]  border rounded  p-3 relative"

                >
                  <Flag code={selectedCountry} className="w-6 h-4 mr-2" />
                  <button className="bg-[#] text-white w-full text-left text-sm focus:outline-none">
                    {countries.find(country => country.code === selectedCountry)?.name || "Select Country"}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-0 top-full  w-full max-h-60 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#815BF5] hover:scrollbar-thumb-[#815BF5] active:scrollbar-thumb-[#815BF5] scrollbar-track-gray-800    bg-black p-2 border  rounded z-50">
                    <input
                      type="text"
                      placeholder="Search Country"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="p-2 mb-2  w-full text-xs focus:border-[#815bf5] text-white outline-none border rounded"
                    />
                    {filteredCountries.map(country => (
                      <div
                        key={country.code}
                        className="flex items-center p-2 text-sm cursor-pointer hover:bg-[#FC8929]  text-white"
                        onClick={() => handleCountryChange(country.code)}
                      >
                        <Flag code={country.code} className="w-6 h-4 mr-2" />
                        {country.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <LabelInputContainer className="mb-8 relative">
                <label
                  htmlFor="whatsappNo"
                  className={cn(
                    "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                    focusedInput.whatsappNo || user.whatsappNo ? "top-[-2px]  px-1 left-2 scale-90" : "top-5 left-10"
                  )}
                >
                  WhatsApp No
                </label>
                <div className="flex  ">
                  <span className="py-3 h- px-2 border bg-[#] text-[#D4D4D4] rounded-lg rounded-r-none  text-xs">{countryCode}</span>
                  <input
                    id="whatsappNo"
                    type="text"
                    value={user.whatsappNo}
                    className={cn(errors.whatsappNo ? "border-red-500" : "", "border w-[350px] p-2 bg-transparent rounded-lg rounded-l-none outline-none focus:border-[#815bf5]")}
                    onFocus={() => setFocusedInput({ ...focusedInput, whatsappNo: true })}
                    onBlur={() => setFocusedInput({ ...focusedInput, whatsappNo: false })}
                    onChange={(e) => handleInputChange("whatsappNo", e.target.value)}
                  />
                </div>
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>

              </LabelInputContainer>
                 <button
                            className="bg-zinc-800 p-2 w-full border rounded-lg hover:bg-zinc-900"
                onClick={onSignup}
                disabled={loading}
              >
                {loading
                  ? <Loader />
                  : showOrganizationForm
                    ? "Sign up "
                    : "Next "}
                <BottomGradient />
              </button>
              <div className="p-4 flex justify-center">
                <Link
                  href="/login"
                  className="text-center hover:underline mt-2"
                >
                  Already a{" "}
                  <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent font-bold">
                    Zapllonian
                  </span>
                  ? Login Here
                </Link>
              </div>
              <p className="text-xs text-center">
                By clicking continue, you agree to our{" "}
                <a href="/terms" className="underline text-blue-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacypolicy" className="underline text-blue-400">
                  Privacy Policy
                </a>
                .
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

              <div className="flex justify-center gap-2">
                <div className="mt-[6px] scale-125">
                  <Home selected />
                </div>
                <Link href="/">
                  <h1 className="hover:underline cursor-pointer">
                    Back to Home
                  </h1>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

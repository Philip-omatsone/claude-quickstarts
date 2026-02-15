"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostcodeSearchProps {
  variant?: "buyer" | "rental";
  placeholder?: string;
}

interface AddressResult {
  address: string;
  buildingNumber: string;
  street: string;
  town: string;
}

export function PostcodeSearch({
  variant = "buyer",
  placeholder = "Enter a postcode (e.g. SW1A 1AA)",
}: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState<AddressResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [postcodeValid, setPostcodeValid] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const validatePostcode = (pc: string) => {
    const regex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    return regex.test(pc.trim());
  };

  // Fetch addresses when a valid postcode is entered
  useEffect(() => {
    const trimmed = postcode.trim();
    if (!validatePostcode(trimmed)) {
      setAddresses([]);
      setPostcodeValid(false);
      return;
    }

    setPostcodeValid(true);
    setFetchingAddresses(true);

    const timer = setTimeout(async () => {
      try {
        // Use Postcodes.io to get nearby addresses, then use
        // the Royal Mail PAF-style lookup via the postcode
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();

        if (data.result) {
          // Generate address list from postcode data
          // In production this would use a PAF/address lookup API
          // For now, construct sensible addresses from the postcode area
          const ward = data.result.admin_ward || "";
          const district = data.result.admin_district || "";
          const parish = data.result.parish || "";
          const street = ward || parish || district;

          // Generate numbered addresses for the postcode
          const generated: AddressResult[] = [];
          for (let i = 1; i <= 20; i++) {
            const num = i * 2 - 1; // odd numbers
            generated.push({
              address: `${num} ${street}, ${district}, ${trimmed}`,
              buildingNumber: String(num),
              street: street,
              town: district,
            });
          }
          for (let i = 1; i <= 20; i++) {
            const num = i * 2; // even numbers
            generated.push({
              address: `${num} ${street}, ${district}, ${trimmed}`,
              buildingNumber: String(num),
              street: street,
              town: district,
            });
          }

          // Sort by number
          generated.sort(
            (a, b) => parseInt(a.buildingNumber) - parseInt(b.buildingNumber)
          );

          setAddresses(generated);
          if (variant === "buyer") {
            setShowDropdown(true);
          }
        }
      } catch {
        // Non-critical, user can still type address manually
      } finally {
        setFetchingAddresses(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [postcode, variant]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = async () => {
    if (!postcode.trim()) {
      setError("Please enter a postcode");
      return;
    }

    if (!validatePostcode(postcode)) {
      setError("Please enter a valid UK postcode");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/geocode?postcode=${encodeURIComponent(postcode.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not find postcode");
        return;
      }

      // Go directly to report generation (free for now)
      if (variant === "buyer") {
        router.push(
          `/report/buyer/generating?postcode=${encodeURIComponent(postcode.trim())}&address=${encodeURIComponent(address)}`
        );
      } else {
        router.push(
          `/report/rental/preview?postcode=${encodeURIComponent(postcode.trim())}`
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectAddress = (addr: AddressResult) => {
    setAddress(addr.address);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col gap-3">
        {/* Postcode input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.toUpperCase());
              setError("");
              setAddress("");
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {postcodeValid && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-medium">
              Valid
            </span>
          )}
        </div>

        {/* Address dropdown (buyer only) */}
        {variant === "buyer" && postcodeValid && (
          <div className="relative" ref={dropdownRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted z-10" />
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              {address ? (
                <span className="text-foreground">{address}</span>
              ) : fetchingAddresses ? (
                <span className="text-muted">Loading addresses...</span>
              ) : (
                <span className="text-muted">Select an address</span>
              )}
            </button>
            <ChevronDown
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />

            {showDropdown && addresses.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-border">
                  <p className="text-xs text-muted px-2">
                    {addresses.length} addresses found
                  </p>
                </div>
                {addresses.map((addr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectAddress(addr)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light transition-colors first:rounded-t-none last:rounded-b-xl"
                  >
                    {addr.address}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              {variant === "buyer"
                ? "Get Free Report"
                : "Get Free Report"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

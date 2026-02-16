"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ChevronDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostcodeSearchProps {
  variant?: "buyer" | "rental";
  placeholder?: string;
}

interface AddressResult {
  address: string;
  source: "land-registry" | "epc" | "manual";
}

const SESSION_KEY = "viven_postcode_search";

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
  const [manualEntry, setManualEntry] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addressButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // For buyer variant, require both valid postcode and address selection
  const canGenerate = postcodeValid && (variant !== "buyer" || address.trim().length > 0);

  // Restore state from sessionStorage on mount (back button support)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const { postcode: pc, address: addr } = JSON.parse(saved);
        if (pc) {
          setPostcode(pc);
          setPostcodeValid(validatePostcode(pc));
        }
        if (addr) setAddress(addr);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist state to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ postcode, address })
      );
    } catch {
      // ignore
    }
  }, [postcode, address]);

  const validatePostcode = (pc: string) => {
    const regex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    return regex.test(pc.trim());
  };

  // Fetch real addresses from Land Registry when a valid postcode is entered
  useEffect(() => {
    const trimmed = postcode.trim();
    if (!validatePostcode(trimmed)) {
      setAddresses([]);
      setPostcodeValid(false);
      return;
    }

    setPostcodeValid(true);

    if (variant !== "buyer") return;

    setFetchingAddresses(true);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        // Use our server-side proxy to avoid CORS issues
        const res = await fetch(
          `/api/address-lookup?postcode=${encodeURIComponent(trimmed.toUpperCase())}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Address lookup failed");

        const json = await res.json();
        const results: AddressResult[] = (json.addresses || []).map(
          (a: { address: string }) => ({
            address: a.address,
            source: "land-registry" as const,
          })
        );

        setAddresses(results);
        if (results.length > 0) {
          setShowDropdown(true);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // Silently fail - user can still use manual entry
      } finally {
        setFetchingAddresses(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
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
        const rentalUrl = address
          ? `/report/rental/preview?postcode=${encodeURIComponent(postcode.trim())}&address=${encodeURIComponent(address)}`
          : `/report/rental/preview?postcode=${encodeURIComponent(postcode.trim())}`;
        router.push(rentalUrl);
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
    setManualEntry(false);
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
              setManualEntry(false);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-16 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (canGenerate) {
                  handleSearch();
                } else {
                  e.preventDefault();
                  if (postcodeValid && variant === "buyer" && !address.trim()) {
                    setShowDropdown(true);
                    addressButtonRef.current?.focus();
                  }
                }
              }
            }}
          />
          {postcodeValid && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-medium">
              Valid
            </span>
          )}
        </div>

        {/* Address selection (buyer only) */}
        {variant === "buyer" && postcodeValid && (
          <>
            {manualEntry || (!fetchingAddresses && addresses.length === 0) ? (
              /* Manual address input — shown when user chooses manual or no addresses found */
              <div>
                <div className="relative">
                  <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 10 Downing Street"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (address.trim()) {
                          handleSearch();
                        } else {
                          e.preventDefault();
                        }
                      }
                    }}
                    autoFocus={manualEntry}
                  />
                </div>
                {!manualEntry && !fetchingAddresses && addresses.length === 0 && (
                  <p className="text-xs text-muted mt-1.5">
                    Enter the property address above to generate your report.
                  </p>
                )}
              </div>
            ) : (
              /* Address dropdown */
              <div className="relative" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted z-10" />
                <button
                  ref={addressButtonRef}
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                >
                  {address ? (
                    <span className="text-foreground">{address}</span>
                  ) : fetchingAddresses ? (
                    <span className="text-muted">Finding addresses...</span>
                  ) : (
                    <span className="text-muted">
                      Select address ({addresses.length} found)
                    </span>
                  )}
                </button>
                <ChevronDown
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />

                {showDropdown && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {addresses.length > 0 && (
                      <>
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
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light transition-colors"
                          >
                            {addr.address}
                          </button>
                        ))}
                      </>
                    )}
                    {/* Manual entry option always shown */}
                    <button
                      type="button"
                      onClick={() => {
                        setManualEntry(true);
                        setShowDropdown(false);
                        setAddress("");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-primary font-medium hover:bg-primary-light transition-colors border-t border-border flex items-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Enter address manually
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Toggle between manual and dropdown */}
            {manualEntry && addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setManualEntry(false);
                  setAddress("");
                }}
                className="text-xs text-primary hover:underline text-left"
              >
                Back to address list
              </button>
            )}
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {variant === "buyer" && postcodeValid && !address.trim() && (
          <p className="text-xs text-amber-600 text-center">
            Please select an address above to generate your report
          </p>
        )}

        <button
          onClick={handleSearch}
          disabled={loading || !canGenerate}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              Get Free Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}

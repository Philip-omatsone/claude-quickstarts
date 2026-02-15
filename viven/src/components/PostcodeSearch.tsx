"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostcodeSearchProps {
  variant?: "buyer" | "rental";
  placeholder?: string;
}

export function PostcodeSearch({
  variant = "buyer",
  placeholder = "Enter a postcode (e.g. SW1A 1AA)",
}: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const validatePostcode = (pc: string) => {
    const regex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    return regex.test(pc.trim());
  };

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
      const res = await fetch(`/api/geocode?postcode=${encodeURIComponent(postcode.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not find postcode");
        return;
      }

      if (variant === "buyer") {
        router.push(
          `/report/buyer/preview?postcode=${encodeURIComponent(postcode.trim())}&address=${encodeURIComponent(address)}`
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

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {variant === "buyer" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Property address (optional)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
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
              {variant === "buyer" ? "Search Property" : "Get Free Report"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

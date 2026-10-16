"use client";

import { Search, ChevronDown } from "lucide-react";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
};

export default function SearchBar({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: SearchBarProps) {
  return (
    <div className="mx-5 rounded-[20px] border border-[#eee8e5] bg-white px-4 py-2 shadow-sm sm:mx-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="flex h-[48px] flex-1 items-center gap-4 rounded-[24px] bg-[#fff8eb] px-5 md:px-8">
          <Search
            size={20}
            strokeWidth={2}
            className="shrink-0 text-[#7b4549]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event, category, or location"
            className="w-full bg-transparent text-base text-[#452b2e] outline-none placeholder:text-[#a99b92] md:text-lg"
          />
        </div>

        {/* Category filter */}
        <div className="relative w-full lg:w-[150px]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-[48px] w-full appearance-none rounded-xl border border-[#eee8e8] bg-white px-3 pr-8 text-sm text-[#452b2e] outline-none focus:border-[#df6c5c]"
          >
            <option value="All">All Categories</option>
            <option value="Music">Music</option>
            <option value="Festival">Festival</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#684b4b]"
          />
        </div>

        {/* Sorting */}
        <div className="relative w-full lg:w-[145px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-[48px] w-full appearance-none rounded-xl border border-[#eee8e8] bg-white px-3 pr-8 text-sm text-[#452b2e] outline-none focus:border-[#df6c5c]"
          >
            <option value="LowToHigh">Low to High</option>
            <option value="HighToLow">High to Low</option>
            <option value="A-Z">A–Z</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#684b4b]"
          />
        </div>
      </div>
    </div>
  );
}

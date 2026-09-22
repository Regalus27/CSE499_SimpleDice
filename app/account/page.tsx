"use client";

// import state and components for the account page
import { useState } from "react";
import AccountDetails from "@/app/components/account/details";
import AccountActivities from "@/app/components/account/activities";
import AccountStatistics from "@/app/components/account/statistics";


type AccountSection = "account" | "activities" | "statistics";



export default function AccountPage() {
  const [activeSection, setActiveSection] =
    useState<AccountSection>("account");

  const isUserLoggedIn = true;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_10px_30px_rgba(20,42,67,0.08)] md:flex-row md:p-8">
        <aside className="md:w-60">
          <h1 className="mb-6 text-2xl font-bold text-[var(--navy)]">
            Account Page
          </h1>

          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            <button
              type="button"
              onClick={() => setActiveSection("account")}
              className={`rounded-xl px-4 py-3 text-left font-medium ${
                activeSection === "account"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--bg)]"
              }`}
            >
              Account Details
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("activities")}
              className={`rounded-xl px-4 py-3 text-left font-medium ${
                activeSection === "activities"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--bg)]"
              }`}
            >
              Activities
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("statistics")}
              className={`rounded-xl px-4 py-3 text-left font-medium ${
                activeSection === "statistics"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--bg)]"
              }`}
            >
              Global Statistics
            </button>
          </nav>
        </aside>

        <main className="min-h-96 flex-1 rounded-[24px] bg-[var(--bg)] p-6">
          {activeSection === "account" && 
          <AccountDetails />
          }

          {activeSection === "activities" && (
            <AccountActivities isUserLoggedIn={isUserLoggedIn} />
          )}

          {activeSection === "statistics" && (
            <AccountStatistics />
          )}
        </main>
      </div>
    </div>
  );
}
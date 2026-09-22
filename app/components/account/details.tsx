export default function AccountDetails() {
    return (
        <section>
              <h2 className="text-2xl font-bold text-[var(--navy)]">
                Account Details
              </h2>
              <div className="mt-6 space-y-4 text-[var(--text)]">
                <p>
                  <span className="font-semibold">Username:</span>{" "}
                  [Your Username]
                </p>
                <button
                  type="button"
                  className="font-medium text-[var(--primary)] hover:underline"
                >
                  Change Password
                </button>
              </div>
        </section>
    );
}
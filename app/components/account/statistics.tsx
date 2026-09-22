export default function AccountStatistics() {
    return (            <section>
              <h2 className="text-2xl font-bold text-[var(--navy)]">
                Global Statistics
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--navy)]">0</p>
                  <p className="mt-1 text-sm text-[var(--text)]/70">
                    Total Rolls
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--navy)]">0</p>
                  <p className="mt-1 text-sm text-[var(--text)]/70">
                    Games Played
                  </p>
                </div>
              </div>
            </section>
    );
}
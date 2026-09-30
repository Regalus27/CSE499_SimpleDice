import EditForm from "../components/account/editPassword/editForm";

export default function EditPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            🎲
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Update Password
          </h1>

          <p className="text-slate-500 mt-2">
            Verify your current credentials to change the password on your existing account.
          </p>
        </div>

        <EditForm />

      </div>
    </main>
  );
}
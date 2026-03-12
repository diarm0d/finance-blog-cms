import Button from "@/components/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Guide Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          {` The finance guide you're looking for might have been moved or deleted.
          Let's get you back to the latest insights.`}
        </p>

        <div className="mt-8 flex justify-center">
          <Button href="/blog" variant="primary">
            Back to Blog
          </Button>
        </div>
      </div>
    </main>
  );
}

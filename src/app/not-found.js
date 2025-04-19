// app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4 text-gray-800">The Page does not Exist</p>
      <p className="text-md mt-2 text-gray-600">
        You may have mistyped the address or the page may have moved.
      </p>
     
    </div>
  );
}

export default function Loading({ showText }) {
  return (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-3 bg-white"
        viewBox="0 0 24 24"
      ></svg>
      {showText && "Chargement"}
    </>
  )
}

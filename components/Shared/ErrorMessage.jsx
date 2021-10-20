export default function ErrorMessage({ error }) {
  return (
    <div className="flex items-center justify-center">
      <p className="font-small text-danger text-center"> {error} </p>
    </div>
  )
}

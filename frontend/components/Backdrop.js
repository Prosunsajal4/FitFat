export default function Backdrop({ onClick, children }) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
    >
      {children}
    </div>
  );
}

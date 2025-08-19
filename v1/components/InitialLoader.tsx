import Image from "next/image";

export default function InitialLoader() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="ring-container animate-pulse">
        <Image
          src="/iloverealestate.png"
          alt="loader"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

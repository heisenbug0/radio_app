import AccountInfo from "@/components/user/account-info";

export default function personal() {
  return (
    <>
      <AccountInfo />
      <span className="font-bold text-2xl">Security Alerts</span>

      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
    </>
  );
}

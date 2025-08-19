import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { addReelApi, deleteReelApi, getAddedPropertiesApi, getReelsApi } from "@/api/apiRoutes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/router";

const UserReels = () => {
  const user = useSelector((s) => s.Auth?.data);
  const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", property_id: "", description: "", video_link: "", public_id: "" });

  const router = useRouter();
  const locale = router.query?.locale || "en-new";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reelsRes, propsRes] = await Promise.all([
        getReelsApi({ user_id: userId }),
        getAddedPropertiesApi({ limit: 100, offset: 0 }),
      ]);
      setRecords(reelsRes?.data || []);
      setProperties(propsRes?.data || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await deleteReelApi({ id });
      fetchData();
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReelApi({ ...form, is_admin: false });
      setOpen(false);
      setForm({ title: "", property_id: "", description: "", video_link: "", public_id: "" });
      fetchData();
    } catch (e) {}
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold brandColor">My Reels</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="brandBg primaryTextColor rounded-md px-4 py-2">Add Reel</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Reel title</label>
                <input
                  className="areaConverterInput primaryBackgroundBg h-[40px] w-full outline-none rounded-md px-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Enter title"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Property linked to</label>
                <Select value={form.property_id} onValueChange={(v) => setForm((p) => ({ ...p, property_id: v }))}>
                  <SelectTrigger className="w-full primaryBackgroundBg secondryTextColor h-[40px]">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-auto">
                    {(properties || []).map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="primaryBackgroundBg h-[100px] w-full outline-none rounded-md px-2 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Max of 500 characters"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (typeof window === "undefined") return;
                    const widget = window.cloudinary?.createUploadWidget(
                      {
                        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET,
                        sources: ["local"],
                        resourceType: "video",
                        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                        uploadSignature: async (cb, paramsToSign) => {
                          const res = await fetch("/api/signed-upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ paramsToSign }),
                          });
                          const data = await res.json();
                          cb(data.signature);
                        },
                      },
                      (error, result) => {
                        if (!error && result && result.event === "success") {
                          const info = result.info;
                          setForm((p) => ({ ...p, video_link: info.secure_url, public_id: info.public_id }));
                        }
                      }
                    );
                    widget && widget.open();
                  }}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Upload video
                </button>
                {form.public_id && <span className="text-sm secondryTextColor">Uploaded</span>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="brandBg primaryTextColor rounded-md px-4 py-2">
                  Submit
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="primaryBackgroundBg">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold">Reel Title</th>
              <th className="px-3 py-2 text-left text-sm font-semibold">Description</th>
              <th className="px-3 py-2 text-center text-sm font-semibold">Views</th>
              <th className="px-3 py-2 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records?.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 text-sm">{r.title}</td>
                <td className="px-3 py-2 text-sm max-w-[300px] truncate">{r.description}</td>
                <td className="px-3 py-2 text-sm text-center">{r.views}</td>
                <td className="px-3 py-2 text-sm text-center">
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {(!records || records.length === 0) && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm secondryTextColor">No data to show</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReels;


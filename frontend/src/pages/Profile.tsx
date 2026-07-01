import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

import { getMe, updateProfile, changePassword } from "../services/authService";

import type { User } from "../types/auth";

function Profile() {
  const token = localStorage.getItem("token");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!token) return;

      const res = await getMe(token);

      setUser(res.user);

      setName(res.user.name || "");

      if (res.user.profile_picture) {
        setPreview(res.user.profile_picture);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      if (selectedImage) {
        formData.append("profile_picture", selectedImage);
      }

      await updateProfile(formData);

      alert("Profile updated successfully!");

      await loadProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    try {
      await changePassword(currentPassword, newPassword);

      alert("Password changed successfully!");

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyReferralCode = async () => {
    if (!user?.referral_code) return;

    await navigator.clipboard.writeText(user.referral_code);

    alert("Referral code copied!");
  };

  if (loading || !user) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">Loading profile...</div>
      </>
    );
  }

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-28 px-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="flex flex-col items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-purple-500"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-purple-600 text-white text-6xl font-bold flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-purple-600 font-semibold"
            >
              Change Photo
            </button>

            <div className="mt-10 w-full max-w-xl space-y-5">
              <div>
                <label className="block font-semibold mb-2">Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Email</label>

                <input
                  value={user.email}
                  disabled
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Role</label>

                <input
                  value={user.role}
                  disabled
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Current Points
                </label>

                <input
                  value={`${user.points_balance.toLocaleString()} pts`}
                  disabled
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Referral Code
                </label>

                <div className="flex w-full gap-3">
                  <input
                    value={user.referral_code || ""}
                    disabled
                    className="flex-1 border rounded-xl p-3 bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="w-24 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold"
              >
                Save Profile
              </button>

              <hr className="my-8" />

              <h2 className="text-2xl font-bold">Change Password</h2>

              <div>
                <label className="block font-semibold mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">New Password</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-black hover:bg-gray-800 text-white p-4 rounded-xl font-semibold"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

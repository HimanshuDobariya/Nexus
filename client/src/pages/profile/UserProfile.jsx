import { Camera, Flashlight, Loader, Pencil } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/profileStore";
import Header from "@/components/common/Header";

const UserProfile = () => {
  const { profile, getProfile, loading, updateProfile } = useProfileStore();

  if (!profile) return null;

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    bio: profile.bio || "",
    jobTitle: profile.jobTitle || "",
    department: profile.department || "",
    organization: profile.organization || "",
    location: profile.location || "",
    profileImage: profile.profileImage || "",
  });
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateProfile(profileData);
      setEditMode(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Can't update your profile data",
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Header
          title="Your Profile"
          description="Manage your profile with nexus."
        />
        {editMode ? (
          <Button
            className="flex items-center gap-2"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading && <Loader className="animate-spin" />} Save Changes
          </Button>
        ) : (
          <Button
            className="flex items-center gap-2"
            onClick={() => setEditMode(!editMode)}
          >
            <Pencil className="text-sm" /> Edit Profile
          </Button>
        )}
      </div>
      <Card className="p-6 space-y-6">
        <div className="flex gap-7">
          <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center relative cursor-pointer group">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover"
              />
            ) : (
              <Avatar className="w-36 h-36 rounded-full bg-gray-600 text-white flex items-center justify-center text-6xl">
                <AvatarFallback>
                  {profileData?.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            {editMode && (
              <>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="text-white text-2xl" />
                </div>
              </>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div>
              {" "}
              <h3 className="text-3xl font-bold mb-2">{profileData.name}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profileData.email}
              </p>
            </div>

            <h3 className="text-xl font-bold mb-4">Bio</h3>
            {editMode ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full bg-white border dark:bg-gray-700 rounded-lg px-3 py-2 "
                placeholder="Tell us about yourself"
              ></textarea>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                {profileData.bio || "No bio added yet"}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8 w-full">
          <div>
            <h3 className="text-xl font-bold mb-4">Professional Information</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {" "}
              {[
                { label: "Job Title", field: "jobTitle" },
                { label: "Department", field: "department" },
                { label: "Organization", field: "organization" },
                { label: "Location", field: "location" },
              ].map((item) => (
                <div
                  key={item.field}
                  className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    {item.label}
                  </label>

                  {editMode ? (
                    <Input
                      type="text"
                      label={item.label}
                      value={profileData[item.field]}
                      onChange={(e) =>
                        handleInputChange(item.field, e.target.value)
                      }
                      className="w-full bg-white dark:bg-gray-700 rounded-lg px-3 py-2 "
                    />
                  ) : (
                    <p className="tex t-gray-800 dark:text-gray-200">
                      {profileData[item.field] || "Not specified"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default UserProfile;

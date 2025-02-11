import { Button, Card, Input } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaCamera } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "react-avatar";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    jobTitle: "",
    department: "",
    organization: "",
    location: "",
    profileImage: "",
  });
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/profile`;

  const getPtofileData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);

      const { profile } = data;
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        jobTitle: profile.jobTitle || "",
        department: profile.department || "",
        organization: profile.organization || "",
        location: profile.location || "",
        profileImage: profile.profileImage || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPtofileData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const { data } = await axios.put(`${API_URL}`, {
        userId: id,
        ...profileData,
      });
      toast.success(data.message);
      setEditMode(false);
      getPtofileData();
    } catch (error) {
      console.log(error);
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
    <div className="bg-gray-100 min-h-screen p-4 ">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-2xl font-medium"> Your Profile </h3>
          {editMode ? (
            <Button
              className="flex items-center gap-2"
              onClick={handleSaveChanges}
            >
              <FaPencilAlt className="text-sm" /> Save Changes
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2"
              onClick={() => setEditMode(!editMode)}
            >
              <FaPencilAlt className="text-sm" /> Edit Profile
            </Button>
          )}
        </div>
        <Card className="p-8 flex flex-col md:flex-row gap-8 ">
          <div className="min-w-fit flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center relative cursor-pointer group">
              {profileData.profileImage ? 
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover"
              /> : <Avatar name={profileData.name} size={"100%"} textSizeRatio={3} />}
              {editMode && (
                <>
                  <input
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
                    <FaCamera className="text-white text-2xl" />
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-3xl font-bold mb-2">{profileData.name}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="space-y-8 w-full">
            <div>
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

            <div>
              <h3 className="text-xl font-bold mb-4">
                Professional Information
              </h3>

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
    </div>
  );
};
export default UserProfile;

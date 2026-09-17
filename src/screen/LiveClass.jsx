// src/pages/meeting/MeetingIndex.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import VideoCallScreen from "@/components/meeting/VideoCallScreen";
import { useGetClientRoleForClassQuery } from "@/store/api/class";
import { useGetDetailQuery } from "@/store/api/auth";
import { saveAuthToStorage, selectCurrentUser } from "@/store/reducer/auth";

const MeetingIndex = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const tokenFromQuery = queryParams.get("token");

  // verify token
  const {
    data: userDetails,
    isSuccess,
    isLoading: userLoading,
    error: userError,
  } = useGetDetailQuery(tokenFromQuery, {
    skip: !tokenFromQuery,
  });
// console.log("Token from query:", userDetails);
  // save auth to redux
  useEffect(() => {
    if (userDetails?.client) {
      console.log("Saving user details to Redux:", userDetails);
      dispatch(saveAuthToStorage(userDetails));
    }
  }, [userDetails, dispatch]);

  // get user from redux
  const userID = useSelector(selectCurrentUser)?.id;
console.log("Current user ID from Redux:", id);
console.log("Class ID from URL params:", userID);
  // role query
  const {
    data: roleData,
    error: roleError,
    isLoading: roleLoading,
  } = useGetClientRoleForClassQuery(
    { clientId: userID, classId: id },
    { skip: !userID && !id }
  );
  console.log("Role data for class:", roleError);

  const isHost = roleData?.role === "INSTRUCTOR";

  const [meetingCode, setMeetingCode] = useState("");

  const [initialSettings, setInitialSettings] = useState({
    isMuted: false,
    isCameraOff: false,
  });

  useEffect(() => {
    if (id) setMeetingCode(id);
  }, [id]);

  const handleEndCall = () => {
    window.history.back();
    setMeetingCode("");
    setInitialSettings({ isMuted: false, isCameraOff: false });
  };

  // loader while verifying token
if (userLoading) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600">
        Verifying meeting link...
      </p>
    </div>
  );
}

  // invalid token
  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Invalid or expired meeting link
      </div>
    );
  }

  // wait until redux userID exists
  if (!userID || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Joining meeting...
      </div>
    );
  }

  return (
    <VideoCallScreen
      meetingCode={meetingCode}
      isHost={isHost}
      onEndCall={handleEndCall}
      initialMuted={initialSettings.isMuted}
      initialCameraOff={initialSettings.isCameraOff}
    />
  );
};

export default MeetingIndex;